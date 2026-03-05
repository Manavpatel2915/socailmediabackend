import { createPost } from "../services/post-service";
import { schedulePostContent } from "../types/type";
import { RoutingKey } from "../services/producer";

export const schedulePostWorker = async (content : schedulePostContent, routingKey:RoutingKey) => {
  if (routingKey === 'SchedulePost') {
    const { title, content: postContent, image, userId } = content;
    await createPost(title, postContent, image, userId);
    console.log("Post SchedulePost successfully");
  }
  if (routingKey === '') {
    console.log("fanout run for schedlepostQueue done ! it worked");
  }
}