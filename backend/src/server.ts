import express from 'express';
import "./middleware/passport-middleware";
import connectdb from './config/databases/connectdb';
import { morganMongoLogger } from "./middleware/morgan-logger-middleware";
import { errorHandler } from "./middleware/error-handler-midddleware";
import routes from "./routes/routes";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
import { env } from "./config/env.config";
import { serverAdapter } from './config/bullBoard';
import { emailQueue } from './queues/emailQueues';
import './workers/emailWorker';
const app = express();
const PORT = env.DB.PORT;

(async () => {
  try {
    await connectdb();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morganMongoLogger);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/admin/queues', serverAdapter.getRouter());
    app.use('/', routes);
    app.use(errorHandler);
    app.get('/test-queue', async (req, res) => {
      try {
        const job = await emailQueue.add('test-email', {
          to: 'test@example.com',
          subject: 'Hello!',
          body: 'BullMQ is working!'
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        const waiting   = await emailQueue.getWaitingCount();
        const active    = await emailQueue.getActiveCount();
        const completed = await emailQueue.getCompletedCount();
        const failed    = await emailQueue.getFailedCount();

        res.json({
          success: true,
          jobId: job.id,
          stats: { waiting, active, completed, failed }
        });

      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger UI → http://localhost:${PORT}/api-docs`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
