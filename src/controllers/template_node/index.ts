import { Application, Request, Response } from 'express';

import { TemplateNode } from '@data/template_node';
import BaseApi from '@utils/BaseApi';

export class TemplateNodeController extends BaseApi<TemplateNode> {
  constructor(app: Application) {
    super(TemplateNode, ['node', 'template']);
    this.register(app);
  }

  public register(app: Application): void {
    app.use('/api/v1/template-node', this.router);
    this.router.get('/', this.getAll);
    this.router.post('/', this.create);
  }
}
