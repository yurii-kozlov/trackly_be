class ApiError<T = unknown> extends Error {
  data: null;
  errors: T[];
  message: string;
  statusCode: number;
  success: boolean;

  constructor(statusCode: number, message = 'Something went wrong', errors: T[], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
