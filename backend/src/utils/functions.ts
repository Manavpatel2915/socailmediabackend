import { mostLikedUser } from "../services/post-service";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";

export const mostLiked = async (maxlike: number, minlike: number) => {
  const data = await mostLikedUser(maxlike, minlike);
  console.log("🚀 ~ mostLiked ~ data:", data);
  const time = new Date().toISOString().replace(/[:.]/g, "-");
  const dirname = path.resolve("src", "likedPostData", time);
  fs.mkdirSync(dirname, { recursive: true });
  await fsPromises.appendFile(
    path.join(dirname, "liked_data.txt"),
    JSON.stringify(data) + "\n",
    "utf8"
  );
};