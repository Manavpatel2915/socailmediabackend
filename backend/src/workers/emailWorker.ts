import { Worker } from 'bullmq';
import redis from "../config/databases/redis";

export const emailWorker = new Worker('email', async (job) => {
  console.log(`Processing job ID: ${job.id}`);
  console.log('Processing job:', job.data);
  console.log('Job done!');
  return { success: true };
}, {
  connection: redis,
  concurrency: 3,
});

emailWorker.on('completed', (job) => {
  console.log(` Job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(` Job ${job.id} failed:`, err.message);
});

console.log('Email worker is running...');
