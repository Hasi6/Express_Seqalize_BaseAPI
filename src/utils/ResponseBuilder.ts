import { Response } from 'express';

export class ResponseBuilder {
  public static successResponse(res: Response, data: object, status = 200, pagination?: boolean) {
    let body: any = {
      errors: null,
      success: true,
    };

    if (pagination) {
      body = {
        ...body,
        ...data,
      };
    } else {
      body = {
        ...body,
        data,
      };
    }

    return res.status(status).json(body);
  }
}
