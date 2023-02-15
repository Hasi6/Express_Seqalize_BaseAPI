import { Application, Request, Response, Router } from 'express';
import { Model, ModelCtor } from 'sequelize';

export default abstract class BaseApi<T extends Model> {
  protected router: Router;
  private model: ModelCtor<T>;

  protected constructor(model: ModelCtor<T>) {
    this.router = Router();
    this.model = model;
  }

  public abstract register(express: Application): void;

  async getAll(
    req: Request,
    res: Response,
    orderBy: string[] = [],
    searchBy: { [key: string]: any } = {},
  ) {
    const order: any = orderBy.map(column => [column, 'ASC']);
    const where: any = searchBy ? { where: searchBy } : {};
    try {
      const items = await this.model.findAll({ ...where, order });
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async get(req: Request, res: Response) {
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

  async create(req: Request, res: Response) {
    const newItem = req.body;
    try {
      const createdItem = await this.model.create(newItem);
      res.status(201).json(createdItem);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}
