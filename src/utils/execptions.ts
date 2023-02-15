import { ValidationError } from 'express-validator';

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string; data?: object }[];
}

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(message: string, public errors: ValidationError[]) {
    super(message);
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  public serializeErrors() {
    return this.errors.map((err: any) => ({
      message: <string>err.msg,
      field: <string>err.param,
    }));
  }
}

export class DatabaseConnectionError extends CustomError {
  reason = 'Error connecting to database';
  statusCode = 500;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  public serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}

export class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(public message: string, public data?: object | null) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  public serializeErrors() {
    return [
      {
        message: this.message,
        data: this.data || {},
      },
    ];
  }
}

export class UnauthorizedError extends CustomError {
  statusCode = 401;
  constructor(public message: string, status?: number) {
    super(message);
    this.statusCode = status || this.statusCode;
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  public serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}

export class NotFoundError extends CustomError {
  statusCode = 404;
  reason = 'Route Not Found';
  constructor(message?: string) {
    super(message || '');
    this.reason = message || this.reason;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  public serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}

export class TooManyRequests extends CustomError {
  statusCode = 429;
  reason = 'Too Many Requests';
  constructor(message?: string) {
    super(message || '');
    this.reason = message || this.reason;
    Object.setPrototypeOf(this, TooManyRequests.prototype);
  }

  public serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
