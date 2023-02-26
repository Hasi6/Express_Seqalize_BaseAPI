import { Application } from 'express';

import { Template } from '@data/template';
import BaseApi from '@utils/BaseApi';

export class TemplateController extends BaseApi<Template> {
  constructor(app: Application) {
    super(Template, ['template-node.template', 'node']);
    this.register(app);
  }

  public register(app: Application): void {
    app.use('/api/v1/template', this.router);
    this.router.get('/', this.getAll);
    this.router.post('/', this.create);
  }
}
