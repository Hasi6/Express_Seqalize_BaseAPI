import User from '@data/user';
import BaseApi from '@utils/BaseApi';
import { Application } from 'express';

export class UserController extends BaseApi<User> {
  constructor(app: Application) {
    super(User);
    this.register(app);
  }

  public register(app: Application): void {
    app.use('/api/user', this.router);
    this.router.get('/', this.get);
  }
}
