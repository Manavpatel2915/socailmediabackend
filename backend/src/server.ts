import express from "express";
import "./middleware/auth-middleware";
import connectDatabase from "./config/databases/connect-database";
import { logger } from "./middleware/logger-middleware";
import { errorHandler } from "./middleware/error-handler-middleware";
import routes from "./routes/routes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json";
import { env } from "./config/env.config";
import { serverAdapter } from "./config/bull-board";
import "./workers/bullmq-notificationworker";
import "./workers/bullmq-userdetails-worker";
import "./workers/bullmq-post-worker";
import { rabbitmqStart } from "./utils/rabbitmq-start";
import { EXCHANGE_TYPE } from "./const/const-value";
import { initSocketServer } from "./config/socket-server";

const app = express();
const server = initSocketServer(app); // ← replaces createServer(app)
const PORT = env.DB.PORT;

(async () => {
  try {
    await connectDatabase();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(logger);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use("/admin/queues", serverAdapter.getRouter());
    app.use("/", routes);
    app.use(errorHandler);
    rabbitmqStart(EXCHANGE_TYPE);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger UI → http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();