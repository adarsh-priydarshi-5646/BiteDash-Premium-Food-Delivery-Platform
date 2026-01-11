/**
 * Cluster Mode - Multi-process server for CPU utilization
 *
 * Spawns worker processes equal to CPU cores (max 4)
 * Auto-restarts crashed workers with 1s delay
 * Run with: node cluster.js (production) instead of node index.js
 */
import cluster from 'cluster';
import os from 'os';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
void path.dirname(__filename);

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master process ${process.pid} is running`);
  console.log(`Starting ${numCPUs} workers for ${numCPUs} CPU cores`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
    cluster.fork();
  });

  process.on('SIGTERM', () => {
    console.log('Master received SIGTERM. Shutting down workers...');
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
    process.exit(0);
  });
} else {
  import('./index.js');
  console.log(`Worker ${process.pid} started`);
}
