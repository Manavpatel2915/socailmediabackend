import { getUserById } from "../services/user-service";
import { getAllPostByUserId } from "../services/post-service";
import { findAllComment } from "../services/comment-service";
import { userDetailsContent } from "../types/type";
import path from "node:path";
import fs from "fs";
import { RoutingKey } from "../services/producer";
import { createZip } from "../utils/creategzip";

export const userDetailsWorker = async (content: userDetailsContent, routingKey: RoutingKey) => {
  if (routingKey === "userDetails") {
    const { user_id } = content;
    const userDataRaw = await getUserById(user_id);
    const postData = await getAllPostByUserId(user_id);
    const commentData = await findAllComment(user_id);
    const dirname = path.resolve("src", "userData");
    const { user_name, email, role, createdAt, updatedAt } = userDataRaw;
    const userdata = { user_name, email, role, createdAt, updatedAt };
    const data = {
      userData: userdata,
      userPost: postData,
      userComment: commentData
    };
    fs.mkdirSync(dirname, { recursive: true });
    fs.writeFileSync(path.join(dirname, `${userDataRaw.user_id}-UserData.json`), JSON.stringify(data, null, 2) + "\n", "utf8");
    createZip(path.join(dirname, `${userDataRaw.user_id}-UserData.json`), path.join(dirname, "UserDataFinal.zip"));
  }
  if (routingKey === "") {
    console.log("fanout run for userDetailsQueue done ! it worked")
  }

}