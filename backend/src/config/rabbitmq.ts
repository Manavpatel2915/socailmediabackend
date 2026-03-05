import amqp, { Connection, Channel } from 'amqplib';
import { env } from './env.config';
import { EXCHANGE } from "../const/const-value"

const RABBITMQ_URL = env.DB.RABBITMQ_URL;


let connection: Connection;
let channel: Channel;

export const connectRabbitMQ = async (): Promise<Channel> => {
  if (channel) return channel;

  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE, 'fanout', { durable: true });
  console.log('RabbitMQ connected');

  return channel;
};

export const getChannel = (): Channel => {
  if (!channel) throw new Error('RabbitMQ not connected');
  return channel;
};