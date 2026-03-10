import { getChannel } from "../config/rabbitmq";
import { EXCHANGE } from "../const/const-value";
import { ExchangeType } from "../const/const-value";

export type RoutingKey = "SchedulePost" | "notification" | "userDetails" | ""

interface MessagePayload {
  msg: string;
  [key: string]: unknown;
}

export const sendMessage = (routingKey: RoutingKey, payload: MessagePayload, exchangeType: ExchangeType): void => {
  const channel = getChannel();

  const resolvedRoutingKey = exchangeType === "fanout" ? "" : routingKey;

  channel.publish(
    EXCHANGE,
    resolvedRoutingKey,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true },

  );

  console.log(`📤 Sent [${routingKey}]:`, payload);
};