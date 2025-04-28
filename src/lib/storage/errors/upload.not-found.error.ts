export class UploadNotFoundException extends Error {
  statusCode: number;

  constructor() {
    super("Upload not found");
    this.statusCode = 404;
    Object.setPrototypeOf(this, UploadNotFoundException.prototype);
  }
}
