import { Router, Request, Response } from "express";
import { sendMessage, RoutingKey } from "../services/producer";
import { EXCHANGE_TYPE } from "../const/const-value";
import cron from "node-cron";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  const { routingKey, msg, ...rest } = req.body as {
    routingKey: RoutingKey;
    msg: string;
  };

  if (!routingKey || !msg) {
    res.status(400).json({ error: "routingKey and msg are required" });
    return;
  }

  try {
    sendMessage(routingKey, { msg, ...rest }, EXCHANGE_TYPE);
    res.status(200).json({ success: true, routingKey, msg });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message", err });
  }
});

router.post("/queues", (req: Request, _res: Response) => {
  const { message } = req.body;
  cron.schedule("* * * * *", () => {
    sendMessage("", { msg: "add data to all queue", message: message }, "fanout");
  });
})

export default router;