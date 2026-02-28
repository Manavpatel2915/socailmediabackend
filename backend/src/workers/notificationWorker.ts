import { Worker } from 'bullmq';
import redis from "../config/databases/redis";
import { createNotification } from "../services/notification-service";
import { findPostById } from "../services/post-service"

export const notificationWorker = new Worker('notification', async (job) => {
  const data = job.data.data;
  const title = job.data.title;
  const postId = data.post_id;
  const postdata = await findPostById(postId)
  const notification_owner = postdata.user_id;
  const message = data.comment ;
  const created_by_user = data.user_id;
  await createNotification(notification_owner, created_by_user, title, message);
  return { success: true };
}, {
  connection: redis,
  concurrency: 3,
});

notificationWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

notificationWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

console.log('userDetails worker is running...');