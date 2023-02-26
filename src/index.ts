require('dotenv').config({ path: `.env` });
require('module-alias/register');
import 'reflect-metadata';
import 'express-async-errors';
import express, { Application, json } from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';
import helmet from 'helmet';
import logger from 'morgan';
import registerRoutes from '@routes/index';
import { NotFoundError } from '@utils/execptions';
import { errorHandler } from '@middlewares/error-handler';
import loggerObj from '@utils/logger';
import { connectDB } from './data';
import { User } from '@data/user';
import { Op } from 'sequelize';
import { Post } from '@data/post';
import { Image } from '@data/image';
import { Template } from '@data/template';
import { Node } from '@data/node';

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

app.listen(PORT, async () => {
  console.log(`Server started at PORT: ${PORT}`);
  await connectDB();
  await seed();
});

const seed = async () => {
  await User.destroy({
    where: {
      id: {
        [Op.ne]: 1000,
      },
    },
  });
  await Post.destroy({
    where: {
      id: {
        [Op.ne]: 1000,
      },
    },
  });
  await Image.destroy({
    where: {
      id: {
        [Op.ne]: 1000,
      },
    },
  });
  const user: any = { name: 'hasi', email: 'hasitha@gmail.com' };
  const newUser = new User(user);
  await newUser.save();
  const posts: any = [
    { title: '1', content: '1', userId: newUser.id },
    { title: '2', content: '2', userId: newUser.id },
    { title: '3', content: '3', userId: newUser.id },
    { title: '4', content: '4', userId: newUser.id },
    { title: '5', content: '5', userId: newUser.id },
    { title: '6', content: '6', userId: newUser.id },
  ];
  await Post.bulkCreate(posts);
  await Image.bulkCreate(posts);

  await Template.destroy({
    where: {
      id: {
        [Op.ne]: 1000,
      },
    },
  });

  await Node.destroy({
    where: {
      id: {
        [Op.ne]: 1000,
      },
    },
  });

  const node1 = new Node({ name: 'node1' } as any);
  const node2 = new Node({ name: 'node2' } as any);
  await node1.save();
  await node2.save();

  const template1: any = { name: 'template1' };
  const template2: any = { name: 'template2' };
  const [tm1, tm2] = await Template.bulkCreate([template1, template2]);

  await tm1.addNode(node1.id);
  await tm1.addNode(node2.id);
  await tm2.addNode(node1.id);
  await tm2.addNode(node2.id);
};
