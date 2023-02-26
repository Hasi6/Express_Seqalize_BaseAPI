import { Application } from 'express';

import { Node } from '@data/node';
import BaseApi from '@utils/BaseApi';

export class NodeController extends BaseApi<Node> {
  constructor(app: Application) {
    super(Node, ['template', 'template-node']);
    this.register(app);
  }

  public register(app: Application): void {
    app.use('/api/v1/node', this.router);
    this.router.get('/', this.getAll);
    this.router.post('/', this.create);
  }
}
