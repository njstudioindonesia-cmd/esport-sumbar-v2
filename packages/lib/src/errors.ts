/**
 * Standard Domain and HTTP Application Errors for ESPORT SUMBAR V3
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, code = "INTERNAL_SERVER_ERROR", isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Akses ditolak: otentikasi diperlukan") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Akses ditolak: izin tidak mencukupi") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Sumber daya", identifier?: string) {
    const detail = identifier ? ` '${identifier}'` : "";
    super(`${resource}${detail} tidak ditemukan`, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Terjadi konflik data") {
    super(message, 409, "CONFLICT");
  }
}

export class ValidationError extends AppError {
  public readonly errors?: unknown;

  constructor(message = "Data yang dikirim tidak valid", errors?: unknown) {
    super(message, 422, "VALIDATION_ERROR");
    this.errors = errors;
  }
}
