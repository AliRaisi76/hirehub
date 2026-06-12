import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import routes from './routes.js';
import { logger } from './config/logger.js';
import { errorMiddleware } from './middlewares/error-handler.middleware.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  pinoHttp({
    logger,
  }),
);

app.use('/api/v1', routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
