export class FileNotFoundException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'FileNotFoundException';
    this.statusCode = 404;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FileNotFoundException);
    }
  }
}