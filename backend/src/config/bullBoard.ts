import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { userDetailsQueues } from "../queues/userdetailsQueues";
import { notificationQueues } from "../queues/notificationQueues";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(userDetailsQueues),
    new BullMQAdapter(notificationQueues),
  ],
  serverAdapter,
});

export { serverAdapter };