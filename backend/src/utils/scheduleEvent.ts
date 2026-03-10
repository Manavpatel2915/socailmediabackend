import cron from "node-cron";
import { mostLiked } from "../utils/functions";

cron.schedule("* * * *", () => {
  mostLiked(3, 100);
}, {
  timezone: "UTC"
});