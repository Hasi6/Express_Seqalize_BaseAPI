import { Application } from 'express';
import * as controllers from '@controllers/index';

export default function registerRoutes(app: Application): void {
  // Dynamically import and register all controllers
  Object.values(controllers).forEach(Controller => new Controller(app));
}
