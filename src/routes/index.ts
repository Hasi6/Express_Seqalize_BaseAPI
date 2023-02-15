import { UserController } from '@controllers/index';
import { Application } from 'express';

export default function registerRoutes(app: Application): void {
  new UserController(app);
}
