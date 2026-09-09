/**
 * Error type the API knows how to serialize. Anything thrown from a service or
 * controller that is an `AppError` becomes `{ error: { code, message } }` with
 * the matching HTTP status (see `middleware/errorHandler.ts`). Anything else
 * becomes a generic 500.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(statusCode: number, message: string, code: string) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, code = "bad-request") {
    super(400, message, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, code = "unauthorized") {
    super(401, message, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, code = "not-found") {
    super(404, message, code);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code = "conflict") {
    super(409, message, code);
  }
}
