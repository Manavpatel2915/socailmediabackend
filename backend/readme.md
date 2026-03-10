//notificationwork building and when create comment then notification go to the postowner 

//is it required to store : who create notification like if c user create notification then need to store it user_id into db ?

//create post middelware after login that middleware run and get all notification from the db according to user_id


direct_logs

import cron from "node-cron";

async function runTask(): Promise<void> {
  console.log("Running async task...");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("Task finished");
}

cron.schedule("*/5 * * * *", async () => {
  await runTask();
});

import cron from "node-cron";

cron.schedule("* * * * *", () => {
  console.log("Running every minute");
});

