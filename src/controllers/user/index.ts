import { Application, Request, Response } from 'express';

import { User } from '@data/user';
import BaseApi from '@utils/BaseApi';

export class UserController extends BaseApi<User> {
  constructor(app: Application) {
    super(User, ['post', 'post.user', 'image', 'image.user']);
    this.register(app);
  }

  public register(app: Application): void {
    app.use('/api/v1/user', this.router);
    this.router.get('/', this.getAll);
    this.router.post('/', this.create);
  }

  public async getAll(req: Request, res: Response) {
    return await super.getAll(req, res);
  }
}
