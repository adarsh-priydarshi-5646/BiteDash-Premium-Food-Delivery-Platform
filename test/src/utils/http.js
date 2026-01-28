import axios from 'axios';

export class HttpClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      validateStatus: () => true
    });
  }

  async get(path) {
    const start = Date.now();
    try {
      const response = await this.client.get(path);
      const time = Date.now() - start;
      return {
        status: response.status,
        time,
        success: response.status >= 200 && response.status < 300,
        data: response.data
      };
    } catch (error) {
      return {
        status: 0,
        time: Date.now() - start,
        success: false,
        error: error.message
      };
    }
  }

  async concurrent(requests, concurrency = 10) {
    const results = [];
    const queue = [...requests];
    const executing = [];

    while (queue.length > 0 || executing.length > 0) {
      while (executing.length < concurrency && queue.length > 0) {
        const req = queue.shift();
        const promise = this.get(req.path)
          .then(result => {
            results.push(result);
            executing.splice(executing.indexOf(promise), 1);
          });
        executing.push(promise);
      }

      if (executing.length > 0) {
        await Promise.race(executing);
      }
    }

    return results;
  }
}

export function calculateStats(times) {
  const sorted = [...times].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const len = sorted.length;

  return {
    min: sorted[0],
    max: sorted[len - 1],
    avg: (sum / len).toFixed(2),
    p50: sorted[Math.floor(len * 0.5)],
    p95: sorted[Math.floor(len * 0.95)],
    p99: sorted[Math.floor(len * 0.99)]
  };
}

export function calculateThroughput(total, seconds) {
  return (total / seconds).toFixed(2);
}

export function calculateSuccessRate(successful, total) {
  return ((successful / total) * 100).toFixed(2);
}
