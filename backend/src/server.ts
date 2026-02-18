import express from 'express';
import "./middleware/passport-middleware";
import connectdb from './config/databases/connectdb';
import { morganMongoLogger } from "./middleware/morgan-logger-middleware";
import { errorHandler } from "./middleware/error-handler-midddleware";
import routes from "./routes/routes";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
import { env } from "./config/env.config";

const app = express();
const PORT = env.DB.PORT;

(async () => {
  try {
    await connectdb();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morganMongoLogger);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/', routes);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger UI → http://localhost:${PORT}/api-docs`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
