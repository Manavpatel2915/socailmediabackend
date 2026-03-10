import { ExchangeType } from "../const/const-value";
import { startConsumer } from "../services/consumer";
import { queueArray } from "../const/const-value";

export const rabbitmqStart = async (EXCHANGE_TYPE: ExchangeType) => {
  if (EXCHANGE_TYPE == "direct") {
    await startConsumer(queueArray);
  }
  if (EXCHANGE_TYPE == "fanout") {
    await startConsumer([""]);
  }
  if (EXCHANGE_TYPE == "topic") {
    await startConsumer(queueArray);
  }
  if (EXCHANGE_TYPE == "headers") {
    await startConsumer(queueArray);
  }
}