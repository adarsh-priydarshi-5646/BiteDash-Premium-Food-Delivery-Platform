import autocannon from 'autocannon';
import { Logger } from '../utils/logger.js';
import { config } from '../config.js';

export async function testAutocannon() {
  const logger = new Logger('Autocannon Load Test');
  logger.header('Industry-standard load testing with autocannon');

  try {
    logger.section('Test Configuration');
    logger.metric('Target URL', config.backend.url);
    logger.metric('Duration', '10 seconds');
    logger.metric('Connections', '10');
    logger.metric('Pipelining', '1');

    logger.section('Running Load Test...');
    
    const result = await autocannon({
      url: `${config.backend.url}/api/health`,
      connections: 10,
      pipelining: 1,
      duration: 10,
      requests: [
        {
          path: '/api/health',
          method: 'GET'
        }
      ]
    });

    logger.section('Load Test Results');
    
    // Requests
    logger.metric('Total Requests', result.requests.total);
    logger.metric('Requests/sec', result.requests.mean.toFixed(2));
    logger.metric('Min Requests/sec', result.requests.min);
    logger.metric('Max Requests/sec', result.requests.max);

    // Latency
    logger.metric('Latency (avg)', `${result.latency.mean.toFixed(2)}ms`);
    logger.metric('Latency (min)', `${result.latency.min}ms`);
    logger.metric('Latency (max)', `${result.latency.max}ms`);
    logger.metric('Latency (p50)', `${result.latency.p50}ms`);
    logger.metric('Latency (p95)', `${result.latency.p95}ms`);
    logger.metric('Latency (p99)', `${result.latency.p99}ms`);

    // Throughput
    logger.metric('Throughput (avg)', `${result.throughput.mean.toFixed(2)} bytes/sec`);
    logger.metric('Throughput (total)', `${result.throughput.total} bytes`);

    // Errors
    logger.metric('Errors', result.errors || 0);
    logger.metric('Timeouts', result.timeouts || 0);

    // Status codes
    if (result.statusCodeStats) {
      logger.section('Status Code Distribution');
      Object.entries(result.statusCodeStats).forEach(([code, count]) => {
        logger.metric(`Status ${code}`, count);
      });
    }

    logger.section('Analysis');
    const avgLatency = result.latency.mean;
    const avgThroughput = result.requests.mean;
    
    if (avgLatency < 500) {
      logger.pass(`Latency excellent: ${avgLatency.toFixed(2)}ms`);
    } else if (avgLatency < 1000) {
      logger.info(`Latency acceptable: ${avgLatency.toFixed(2)}ms`);
    } else {
      logger.fail(`Latency high: ${avgLatency.toFixed(2)}ms`);
    }

    if (avgThroughput > 100) {
      logger.pass(`Throughput good: ${avgThroughput.toFixed(2)} req/sec`);
    } else if (avgThroughput > 50) {
      logger.info(`Throughput moderate: ${avgThroughput.toFixed(2)} req/sec`);
    } else {
      logger.fail(`Throughput low: ${avgThroughput.toFixed(2)} req/sec`);
    }

    logger.duration();
    return true;

  } catch (error) {
    logger.fail(`Test failed: ${error.message}`);
    return false;
  }
}
