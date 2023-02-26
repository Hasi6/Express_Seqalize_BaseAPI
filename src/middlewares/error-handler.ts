import { Request, Response, NextFunction } from 'express';
import { CustomError } from '@utils/execptions';

export const errorHandler = (_err: Error, _req: Request, _res: Response, _next: NextFunction) => {
  if (_err instanceof CustomError) {
    return _res
      .status(_err.statusCode)
      .json({ errors: _err.serializeErrors(), success: false, data: null });
  }
  console.error(_err);
  return _res.status(500).json({
    errors: [
      {
        message: 'Something went Wrong',
        field: _err,
      },
    ],
  });
};
