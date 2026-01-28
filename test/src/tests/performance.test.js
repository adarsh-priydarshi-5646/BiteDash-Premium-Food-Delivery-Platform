import { HttpClient, calculateStats, calculateThroughput, calculateSuccessRate } from '../utils/http.js';
import { Logger } from '../utils/logger.js';
import { config } from '../config.js';

export async function testPerformance() {
  const logger = new Logger('Performance Test');
  logger.header('Testing system performance under load');

  try {
    const client = new HttpClient(config.backend.url);

    const scenarios = [
      { name: 'Light', requests: 50, concurrent: 10 },
      { name: 'Normal', requests: 100, concurrent: 20 },
      { name: 'Heavy', requests: 250, concurrent: 50 },
      { name: 'Stress', requests: 500, concurrent: 100 }
    ];

    const results = [];

    for (const scenario of scenarios) {
      logger.section(`${scenario.name} Load`);

      const requests = Array(scenario.requests)
        .fill(null)
        .map(() => ({ path: '/api/health' }));

      const start = Date.now();
      const responses = await client.concurrent(requests, scenario.concurrent);
      const duration = (Date.now() - start) / 1000;

      const successful = responses.filter(r => r.success).length;
      const times = responses.map(r => r.time);
      const stats = calculateStats(times);
      const throughput = calculateThroughput(scenario.requests, duration);
      const successRate = calculateSuccessRate(successful, scenario.requests);

      logger.metric('Requests', scenario.requests);
      logger.metric('Concurrent', scenario.concurrent);
      logger.metric('Throughput', throughput, 'req/sec');
      logger.metric('Success Rate', successRate, '%');
      logger.metric('Avg Response', stats.avg, 'ms');
      logger.metric('P95 Latency', stats.p95, 'ms');
      logger.metric('P99 Latency', stats.p99, 'ms');

      results.push({
        scenario: scenario.name,
        throughput: parseFloat(throughput),
        successRate: parseFloat(successRate),
        p95: stats.p95
      });
    }

    logger.section('Summary');
    results.forEach(r => {
      logger.info(`${r.scenario}: ${r.throughput} req/sec, ${r.successRate}% success, P95: ${r.p95}ms`);
    });

    logger.duration();
    return true;

  } catch (error) {
    logger.fail(`Test failed: ${error.message}`);
    return false;
  }
}
