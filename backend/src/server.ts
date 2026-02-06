import express from 'express';
import passport from "passport";
import "./middleware/passport-middleware";
import connectdb from './config/connectdb';
import { morganMongoLogger } from "./middleware/morgan-logger-middleware";
import { errorHandler } from "./middleware/error-handler-midddleware";
import routes from "./routes/routes";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectdb();
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morganMongoLogger);
    app.use(passport.initialize());

    // Your actual API routes (Express)
    app.use('/', routes);

    // Swagger UI using TSOA-generated swagger.json
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` Swagger docs available at http://localhost:${PORT}/api-docs`);
    });

  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
})();