import { connectRabbitMQ } from '../config/rabbitmq';
import { EXCHANGE } from "../const/const-value"
import { RoutingKey } from './producer';
import { notificationWorker } from "../workers/rabbitmq-notification-worker";
import { schedulePostWorker } from "../workers/rabbit-schedlepost-worker";
import { userDetailsWorker } from "../workers/rabbitmq-userdetails-worker";

export const startConsumer = async (routingKeys: RoutingKey[]): Promise<void> => {

  const channel = await connectRabbitMQ();
  const queueName = `queue_${routingKeys.join('_')}`;

  await channel.assertQueue(queueName, { durable: true });
  if (routingKeys) {
    for (const key of routingKeys) {
      await channel.bindQueue(queueName, EXCHANGE, key);
      console.log(`🔗 Bound [${key}] → ${queueName}`);
    }
  }

  channel.prefetch(1);

  channel.consume(queueName, async (msg) => {
    if (!msg) return;

    try {

      const content = JSON.parse(msg.content.toString());
      const routingKey = msg.fields.routingKey as RoutingKey;
      console.log(`📥 Received [${routingKey}]:`, content);
      if (routingKey === "SchedulePost" || routingKey === '') {
        schedulePostWorker(content, routingKey);
      } if (routingKey === "notification" || routingKey === '') {
        notificationWorker(content, routingKey);
      } if (routingKey === "userDetails" || routingKey === '') {
        userDetailsWorker(content, routingKey);
      }
      channel.ack(msg);
    } catch (error) {
      console.error(" Error processing message:", error);
      channel.nack(msg, false, true);
    }
  });

  console.log(` Consumer listening for: ${routingKeys.join(', ')}`);
};