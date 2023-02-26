import { Application, Request, Response, Router } from 'express';
import { Model, ModelCtor } from 'sequelize';
import { ResponseBuilder } from '@utils/ResponseBuilder';
import { posts, users, images, nodes, templates } from '@data/index';
import { BadRequestError } from './execptions';

const modelMap: { [modelName: string]: any } = {
  post: posts,
  user: users,
  image: images,
  node: nodes,
  template: templates,
};

function getIncludeParam(models: string[]): any {
  const model = models[0];
  let includeParam: any = {
    model: modelMap[model],
    include: [],
  };

  if (models.length > 1) {
    includeParam.include.push(getIncludeParam(models.slice(1)));
  }

  return includeParam;
}

function getIncludeParams(includeString: string): any[] {
  const includeArr = includeString.split(',');
  const includeParams: any[] = includeArr.map(include => {
    const models = include.split('.');
    return getIncludeParam(models);
  });
  return includeParams.filter(param => param.model);
}

export default abstract class BaseApi<T extends Model> {
  protected router: Router;
  private model: ModelCtor<T>;

  private allowedIncludes: string[] = [];

  protected constructor(model: ModelCtor<T>, allowedIncludes: string[]) {
    this.router = Router();
    this.model = model;

    this.allowedIncludes = allowedIncludes;

    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
  }

  public abstract register(express: Application): void;

  public async getAll(req: Request, res: Response) {
    // const { orderBy, searchBy, include } = req.query;
    // const options: FindOptions<{ order: Order }> = {};
    // const orderByArray = orderBy
    //   ? Array.isArray(orderBy)
    //     ? (orderBy as string[])
    //     : [orderBy as string]
    //   : [];

    // if (orderBy) {
    //   options.order = orderByArray?.map(column => [column, 'ASC']) || [];
    // }
    // if (searchBy) {
    //   options.where = {
    //     [Op.or]: this.getSearchFields().map(field => ({
    //       [field]: { [Op.substring]: searchBy },
    //     })),
    //   };
    // }
    // if (include) {
    //   const includeModels = include.toString().split(',');
    //   // @ts-ignore
    //   options.include = includeModels.map(model => ({ model: models[model] }));
    // }

    // const results = await this.model.findAll(options);
    const includeString = req.query.include?.toString() || '';
    const includesToCheck = ((req.query.include as string) || '').split(',');
    const includeParams = getIncludeParams(includeString);
    const extraIncludes = includesToCheck.filter(
      include => !this.allowedIncludes.includes(include),
    );
    if (extraIncludes.length > 0 && extraIncludes[0] !== '') {
      throw new BadRequestError(
        `Invalid includes found: ${extraIncludes.join(', ')}, only ${this.allowedIncludes.join(
          ', ',
        )} are valid`,
      );
    }

    const data = await this.model.findAll({
      include: includeParams,
    });
    return ResponseBuilder.successResponse(res, data, 200);
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
