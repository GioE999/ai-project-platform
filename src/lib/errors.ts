export abstract class DomainError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export class ValidationError extends DomainError {
  readonly statusCode = 400;
  readonly code = "VALIDATION_ERROR";
}

export class NotFoundError extends DomainError {
  readonly statusCode = 404;
  readonly code = "NOT_FOUND";
}

export class AuthorizationError extends DomainError {
  readonly statusCode = 403;
  readonly code = "FORBIDDEN";
}

export class AuthenticationError extends DomainError {
  readonly statusCode = 401;
  readonly code = "UNAUTHORIZED";
}

export class ConflictError extends DomainError {
  readonly statusCode = 409;
  readonly code = "CONFLICT";
}

export class AgentError extends DomainError {
  readonly statusCode = 502;
  readonly code = "AGENT_ERROR";

  constructor(message: string, public readonly agentType: string) {
    super(message);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      agent: this.agentType,
    };
  }
}

export class ExternalServiceError extends DomainError {
  readonly statusCode = 503;
  readonly code = "EXTERNAL_SERVICE_ERROR";

  constructor(message: string, public readonly service: string) {
    super(message);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      service: this.service,
    };
  }
}
