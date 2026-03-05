import { getUserById } from "../services/user-service";
import { getAllPostByUserId } from "../services/post-service";
import { findAllComment } from "../services/comment-service";
import { userDetailsContent } from "../types/type";
import path from 'node:path';
import fs from "fs";
import { RoutingKey } from "../services/producer";

export const userDetailsWorker = async (content: userDetailsContent, routingKey: RoutingKey) => {
  if (routingKey === 'userDetails') {
    const { user_id } = content;
    const userData = await getUserById(user_id);
    const postData = await getAllPostByUserId(user_id);
    const commentData = await findAllComment(user_id);
    const dirname = path.resolve("src", "userData");
    const data = {
      userData,
      userPost: postData,
      userComment: commentData
    };
    fs.mkdirSync(dirname, { recursive: true });
    fs.writeFileSync(path.join(dirname, "Userdata.txt"), JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
  if (routingKey === '') {
    console.log("fanout run for userDetailsQueue done ! it worked")
  }

}