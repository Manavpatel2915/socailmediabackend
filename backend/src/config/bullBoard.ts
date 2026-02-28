import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { userDetailsQueues } from "../queues/userdetailsQueues";
import { notificationQueues } from "../queues/notificationQueues";
import { creatPostQueues } from '../queues/createPostQueues';
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(userDetailsQueues),
    new BullMQAdapter(notificationQueues),
    new BullMQAdapter(creatPostQueues)
  ],
  serverAdapter,
});

export { serverAdapter };