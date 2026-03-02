import { Worker } from 'bullmq';
import redis from "../config/databases/redis-connect";
import { getUserById } from "../services/user-service";
import { getAllPostByUserId } from "../services/post-service";
import { findAllComment } from "../services/comment-service";
// import fs from 'fs';
// import path from "path";
import { sendMail } from '../services/mail-service';

export const userDetailsWorker = new Worker('userDetails', async (job) => {

  const userId = job.data.user_id;
  const { user_name, email } = await getUserById(userId);
  const userData = {
    user_name,
    email
  }
  // const userData = await db.User.findOne({
  //   where: {
  //     user_id: user_id
  //   },
  //   attributes: {
  //     exclude: ['user_id', 'password', 'role']
  //   }
  // });
  const postData = await getAllPostByUserId(userId);
  // const postData = await db.Post.findAll({
  //   where: {
  //     user_id: user_id
  //   },
  //   attributes: {
  //     exclude: ['post_id', 'user_id' ]
  //   } });
  const commentData = await findAllComment(userId)
  // const commentdata = await db.Comment.findAll({
  //   where: {
  //     user_id: user_id
  //   },
  //   attributes: {
  //     exclude: ['id']
  //   }
  // });

  const data = {
    userData,
    userPost: postData,
    userComment: commentData
  };

  await sendMail({
    to: `${userData.email}`,
    subject: "UserAllDataDowload",
    text: JSON.stringify(data)
  })
  // const dirname = path.resolve("src", "userData");
  // fs.mkdirSync(dirname, { recursive: true });
  // fs.writeFileSync(path.join(dirname, "Userdata.txt"), JSON.stringify(data, null, 2) + '\n', 'utf8');
  return { success: true };
}, {
  connection: redis,
  concurrency: 3,
});

userDetailsWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

userDetailsWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

console.log('userDetails worker is running...');
