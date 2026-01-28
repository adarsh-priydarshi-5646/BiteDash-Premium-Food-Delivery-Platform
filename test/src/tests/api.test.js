import { HttpClient, calculateStats, calculateThroughput, calculateSuccessRate } from '../utils/http.js';
import { Logger } from '../utils/logger.js';
import { config } from '../config.js';

export async function testAPI() {
  const logger = new Logger('API Test');
  logger.header('Testing REST API endpoints');

  try {
    const client = new HttpClient(config.backend.url);

    logger.section('Health Check');
    const health = await client.get('/api/health');
    
    if (health.success) {
      logger.pass('Backend online');
      logger.metric('Response Time', health.time, 'ms');
      logger.metric('Status', health.status);
      if (health.data) {
        logger.metric('Uptime', health.data.uptime || 'N/A', 's');
        logger.metric('Memory', health.data.memory || 'N/A', 'MB');
      }
    } else {
      logger.fail('Backend offline');
      return false;
    }

    logger.section('Load Test');
    const requests = Array(config.tests.loadTest.totalRequests)
      .fill(null)
      .map(() => ({ path: '/api/health' }));

    const start = Date.now();
    const results = await client.concurrent(
      requests,
      config.tests.loadTest.concurrentRequests
    );
    const duration = (Date.now() - start) / 1000;

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const times = results.map(r => r.time);
    const stats = calculateStats(times);
    const throughput = calculateThroughput(config.tests.loadTest.totalRequests, duration);
    const successRate = calculateSuccessRate(successful, config.tests.loadTest.totalRequests);

    logger.metric('Total Requests', config.tests.loadTest.totalRequests);
    logger.metric('Concurrent', config.tests.loadTest.concurrentRequests);
    logger.metric('Successful', successful);
    logger.metric('Failed', failed);
    logger.metric('Success Rate', successRate, '%');
    logger.metric('Duration', duration.toFixed(2), 's');
    logger.metric('Throughput', throughput, 'req/sec');

    logger.section('Response Time Statistics');
    logger.metric('Min', stats.min, 'ms');
    logger.metric('Max', stats.max, 'ms');
    logger.metric('Avg', stats.avg, 'ms');
    logger.metric('P50', stats.p50, 'ms');
    logger.metric('P95', stats.p95, 'ms');
    logger.metric('P99', stats.p99, 'ms');

    logger.section('Analysis');
    if (throughput >= 125) {
      logger.pass(`Throughput target met: ${throughput} req/sec`);
    } else {
      logger.info(`Throughput: ${throughput} req/sec`);
    }

    if (successRate >= 95) {
      logger.pass(`Success rate: ${successRate}%`);
    }

    logger.duration();
    return true;

  } catch (error) {
    logger.fail(`Test failed: ${error.message}`);
    return false;
  }
}
