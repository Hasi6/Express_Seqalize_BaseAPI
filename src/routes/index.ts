import { Application } from 'express';

import { UserController, TemplateNodeController } from '@controllers/index';

export default function registerRoutes(app: Application): void {
  new UserController(app);
  new TemplateNodeController(app);
}
