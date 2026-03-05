import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { userDetailsQueues } from "../queues/user-details-queues";
import { notificationQueues } from "../queues/notification-queues";
import { createPostQueues } from '../queues/post-queues';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(userDetailsQueues),
    new BullMQAdapter(notificationQueues),
    new BullMQAdapter(createPostQueues)
  ],
  serverAdapter,
});

export { serverAdapter };