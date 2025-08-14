class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  send(res) {
    return res
      .status(this.statusCode)
      .type("application/problem+json")
      .json({
        type: `/problem/types/${this.statusCode}`,
        title: this.name || "Error",
        status: this.statusCode,
        detail: this.message || "Internal Server Error",
      });
  }
}

// ----------- Конкретные типы ошибок -----------
class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

class ServiceUnavailableError extends ApiError {
  constructor(message = "Service Unavailable") {
    super(message, 503);
  }
}

// ----------- Глобальный обработчик ошибок -----------
const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return err.send(res);
  }

  return new ApiError(err.message || "Internal Server Error", 500).send(res);
};

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ServiceUnavailableError,
  errorHandler,
};
