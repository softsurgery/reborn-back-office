export class StorageBadRequestException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'StorageBadRequestException';
    this.statusCode = 400;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StorageBadRequestException);
    }
  }
}