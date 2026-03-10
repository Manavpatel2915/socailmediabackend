import { notificationContent } from "../types/type"
import { findPostById } from "../services/post-service";
import { createNotification } from "../services/notification-service";
import { RoutingKey } from "../services/producer";

export const notificationWorker = async (content: notificationContent, routingKey: RoutingKey) => {
  if (routingKey === "notification") {
    const { title, post_id, comment, user_id } = content;
    const postData = await findPostById(post_id);
    const notification_owner = postData.user_id;
    const data = await createNotification(notification_owner, user_id, title, comment);
    console.log(`Notification added successfully ${data}`);
  }
  if (routingKey === "") {
    console.log("fanout run for notificationQueue done ! it worked")
  }
}