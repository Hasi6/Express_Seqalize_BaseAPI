import { Application } from 'express';

import {
  UserController,
  TemplateNodeController,
  TemplateController,
  NodeController,
} from '@controllers/index';

export default function registerRoutes(app: Application): void {
  new UserController(app);
  new TemplateNodeController(app);
  new TemplateController(app);
  new NodeController(app);
}
