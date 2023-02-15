import { Application, Request, Response, Router } from 'express';
import { Model, ModelCtor } from 'sequelize';
import { ResponseBuilder } from '@utils/ResponseBuilder';

export default abstract class BaseApi<T extends Model> {
  protected router: Router;
  private model: ModelCtor<T>;

  protected constructor(model: ModelCtor<T>) {
    this.router = Router();
    this.model = model;

    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
  }

  public abstract register(express: Application): void;

  public async getAll(
    req: Request,
    res: Response,
    orderBy?: string[],
    searchBy?: { [key: string]: any },
  ) {
    const order: any = orderBy?.map(column => [column, 'ASC']) || [];
    const where: any = searchBy ? { where: searchBy } : {};
    const items = await this.model.findAll({ ...where, order });
    return ResponseBuilder.successResponse(res, items, 200);
  }

  public async get(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const item = await this.model.findByPk(id);
      if (item) {
        res.status(200).json(item);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  public async create(req: Request, res: Response) {
    const newItem = req.body;
    const createdItem = await this.model.create(newItem);
    return ResponseBuilder.successResponse(res, createdItem, 201);
  }
}
