require('dotenv').config({ path: `.env` });
require('module-alias/register');
import 'reflect-metadata';
import 'express-async-errors';
import express, { Application, json, Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';
import helmet from 'helmet';
import logger from 'morgan';
import registerRoutes from '@routes/index';
import { NotFoundError } from '@utils/execptions';
import { errorHandler } from '@middlewares/error-handler';
import loggerObj from '@utils/logger';
import http from 'http';
import { connectDB } from './data';

const app: Application = express();

const PORT: string = process.env.PORT || '3600';

app.use(json());
app.use(
  cors({
    origin: '*',
  }),
);
app.use(helmet());
app.use(logger('dev'));

app.all('*', (req, _res, next) => {
  const correlationId = (req?.headers['x-correlation-id'] as string) || uuid();
  loggerObj.debug('Request', {
    headers: req.headers,
    query: req.query,
    body: req.body,
    ip: req.ip,
    'x-correlation-id': correlationId,
  });
  req.headers['x-correlation-id'] = correlationId;

  return next();
});

registerRoutes(app);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const server = http.createServer(app);

app.listen(PORT, async () => {
  console.log(`Server started at PORT: ${PORT}`);
  await connectDB();
});
