import { Application, Request, Response, Router } from 'express';
import { FindOptions, Model, ModelCtor, Op, Order } from 'sequelize';
import { ResponseBuilder } from '@utils/ResponseBuilder';
import { posts } from '@data/index';

const models = { posts };

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

  public async getAll(req: Request, res: Response) {
    const { orderBy, searchBy, include } = req.query;
    const options: FindOptions<{ order: Order }> = {};
    const orderByArray = orderBy
      ? Array.isArray(orderBy)
        ? (orderBy as string[])
        : [orderBy as string]
      : [];

    if (orderBy) {
      options.order = orderByArray?.map(column => [column, 'ASC']) || [];
    }
    if (searchBy) {
      options.where = {
        [Op.or]: this.getSearchFields().map(field => ({
          [field]: { [Op.substring]: searchBy },
        })),
      };
    }
    if (include) {
      const includeModels = include.toString().split(',');
      // @ts-ignore
      options.include = includeModels.map(model => ({ model: models[model] }));
    }

    const results = await this.model.findAll(options);
    return ResponseBuilder.successResponse(res, results, 200);
  }

  protected getSearchFields(): string[] {
    return ['name', 'email'];
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
