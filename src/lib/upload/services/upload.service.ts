import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { UploadRepository } from "../repositories/upload.repository";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Upload } from "@/types/upload";
import { v4 as uuidv4 } from "uuid";
import { join } from "path";
import { createReadStream, promises as fs, ReadStream, constants } from "fs";
import * as mime from "mime-types";

export class UploadService {
  private readonly uploadRepository: UploadRepository;
  protected readonly rootLocation: string;
  
  constructor(uploadRepository: UploadRepository) {
    this.uploadRepository = uploadRepository;
    this.rootLocation = process.env.UPLOAD_PATH || '/upload';
  }
  

  async getPaginatedRoles(
    queryObject: IQueryObject
  ): Promise<Paginated<Upload>> {
    return this.uploadRepository.findPaginated(queryObject);
  }

  async getUploadBySlug(slug: string): Promise<Upload | null> {
    return this.uploadRepository.findOneByCondition({
      filter: `slug||$eq||${slug}`,
    });
  }

  async getUploadById(id: number): Promise<Upload | null> {
    return this.uploadRepository.findById(id);
  }

  async getAllUploads(queryObject: IQueryObject): Promise<Upload[]> {
    return this.uploadRepository.findByCondition(queryObject);
  }

  async store(file: Express.Multer.File): Promise<Upload> {
    const slug = uuidv4();
    const filename = file.originalname;
    const mimetype = file.mimetype;
    const size = file.size;
    const extension = mime.extension(mimetype) || "";

    let relativePath = slug;
    if (extension) {
      relativePath += `.${extension}`;
    }

    const upload = await this.uploadRepository.create({
      slug,
      filename,
      mimetype,
      size,
      relativePath,
    });

    const destinationFile = join(this.rootLocation, relativePath);
    try {
      await fs.mkdir(this.rootLocation, { recursive: true });
      await fs.writeFile(destinationFile, file.buffer);
    } catch (err: any) {
      console.error("Failed to store file: " + err.message);
    }
    return upload;
  }

  async storeMultipleFiles(files: Express.Multer.File[]): Promise<Upload[]> {
    return Promise.all(files.map((file) => this.store(file)));
  }

  async loadResource(slug: string): Promise<ReadStream | null> {
    const upload = await this.getUploadBySlug(slug);
    if (!upload) {
      console.error("Upload not found");
      return null;
    }
    const filePath = join(this.rootLocation, upload.relativePath);
    try {
      await fs.access(filePath, constants.F_OK);
      return createReadStream(filePath);
    } catch (err: any) {
      console.error("File not found: " + err.message);
      return null;
    }
  }

  async duplicateUpload(id: number): Promise<Upload | null> {
    const originalUpload = await this.getUploadById(id);
    if (!originalUpload) {
      console.error("Original file not found");
      return null;
    }

    const newSlug = uuidv4();
    const fileExtension = mime.extension(originalUpload.mimetype) || "";
    let newRelativePath = newSlug;
    if (fileExtension) {
      newRelativePath += `.${fileExtension}`;
    }

    const originalFilePath = join(
      this.rootLocation,
      originalUpload.relativePath
    );
    const newFilePath = join(this.rootLocation, newRelativePath);

    try {
      await fs.copyFile(originalFilePath, newFilePath);
    } catch (error: any) {
      console.error(`Failed to duplicate file: ${error.message}`);
      return null;
    }

    return this.uploadRepository.create({
      slug: newSlug,
      filename: originalUpload.filename,
      mimetype: originalUpload.mimetype,
      size: originalUpload.size,
      relativePath: newRelativePath,
    });
  }

  async duplicateManyUploads(ids: number[]): Promise<Upload[]> {
    return Promise.all(ids.map((id) => this.duplicateUpload(id))).then(
      (results) => results.filter(Boolean) as Upload[]
    );
  }

  async deleteUpload(id: number): Promise<Upload | null> {
    const upload = await this.getUploadById(id);
    if (!upload) {
      console.error("Upload not found");
      return null;
    }

    const filePath = join(this.rootLocation, upload.relativePath);
    try {
      await fs.access(filePath, constants.F_OK);
      await fs.unlink(filePath);
    } catch (error: any) {
      console.warn(`File already deleted or not found: ${filePath}`);
    }
    await this.uploadRepository.softDelete(upload.id);
    return upload;
  }

  async deleteManyUploads(ids: number[]): Promise<Upload[]> {
    return this.uploadRepository.softDeleteMany(ids);
  }

  async countUploads(where: any = {}): Promise<number> {
    return this.uploadRepository.count(where);
  }
}
