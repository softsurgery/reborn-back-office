import { promises as fs } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";
import formidable from "formidable";
import { UploadRepository } from "../repositories/upload.repository";
import { StorageBadRequestException } from "../errors/storage.bad-request.error";
import { FileNotFoundException } from "../errors/file.not-found.error";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { NextApiRequest } from "next";
import {
  parseBooleanField,
  parseStringField,
} from "@/lib/object.util";
import { Upload } from "@/prisma/interfaces";

export class StorageService {
  private uploadRepository: UploadRepository;
  private uploadPath = process.env.UPLOAD_PATH || "./uploads";

  constructor(uploadRepository: UploadRepository) {
    this.uploadRepository = uploadRepository;
  }

  async storeParsed(fields: formidable.Fields, file: formidable.File) {
    const slug = uuidv4();
    const filename = file.originalFilename || "";
    const mimetype = file.mimetype || "";
    const size = file.size;
    const extension = mime.extension(mimetype) || "";

    const isPublic = parseBooleanField(fields.isPublic);
    const userId = parseStringField(fields.userId);

    if (!userId) {
      throw new StorageBadRequestException("User ID is required");
    }

    let relativePath = extension ? `${slug}.${extension}` : slug;
    const destinationFile = join(this.uploadPath, relativePath);

    try {
      await fs.mkdir(this.uploadPath, { recursive: true });
      await fs.rename(file.filepath, destinationFile);

      return this.uploadRepository.create({
        slug,
        filename,
        mimetype,
        size,
        relativePath,
        userId,
        isPublic,
      });
    } catch (error: any) {
      throw new StorageBadRequestException(
        `Failed to store file: ${error.message}`
      );
    }
  }

  async storeMultipleParsed(
    fields: formidable.Fields,
    files: formidable.File[]
  ) {
    const userId = parseStringField(fields.userId);

    if (!userId) {
      throw new StorageBadRequestException("User ID is required");
    }

    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file, index) => {
          const slug = uuidv4();
          const filename = file.originalFilename || "";
          const mimetype = file.mimetype || "";
          const size = file.size;
          const extension = mime.extension(mimetype) || "";

          let isPublic = false;
          const isPublicKey = `isPublic_${index}`;

          if (fields[isPublicKey] !== undefined) {
            isPublic = parseBooleanField(fields[isPublicKey]);
          } else if (Array.isArray(fields.isPublic)) {
            isPublic = fields.isPublic[index] === "true";
          } else if (typeof fields.isPublic === "string") {
            isPublic = fields.isPublic === "true";
          }

          const relativePath = extension ? `${slug}.${extension}` : slug;
          const destinationFile = join(this.uploadPath, relativePath);

          await fs.mkdir(this.uploadPath, { recursive: true });
          await fs.rename(file.filepath, destinationFile);

          return this.uploadRepository.create({
            slug,
            filename,
            mimetype,
            size,
            relativePath,
            userId,
            isPublic,
          });
        })
      );

      return uploadedFiles;
    } catch (error: any) {
      throw new StorageBadRequestException(
        `Failed to store files: ${error.message}`
      );
    }
  }

  async store(req: NextApiRequest) {
    const { fields, files } = await this.parseForm(req);

    const file = files.file?.[0];
    if (!file) {
      throw new StorageBadRequestException("No file uploaded.");
    }

    return this.storeParsed(fields, file);
  }

  async storeMultiple(req: NextApiRequest) {
    const { fields, files } = await this.parseForm(req);

    const uploadedFiles = files.file;
    if (!uploadedFiles || !Array.isArray(uploadedFiles)) {
      throw new StorageBadRequestException("No files uploaded.");
    }

    return this.storeMultipleParsed(fields, uploadedFiles);
  }

  parseForm(
    req: NextApiRequest
  ): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
    const form = formidable({
      uploadDir: this.uploadPath,
      keepExtensions: true,
      multiples: true,
    });

    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(
            new StorageBadRequestException(
              "Error processing the file(s): " + err.message
            )
          );
        } else {
          resolve({ fields, files });
        }
      });
    });
  }

  async getPaginatedUploads(
    queryObject: IQueryObject
  ): Promise<Paginated<Upload>> {
    return this.uploadRepository.findPaginated(queryObject);
  }

  async getAllUploads(queryObject: IQueryObject): Promise<Upload[]> {
    return this.uploadRepository.findByCondition(queryObject);
  }

  async findBySlug(slug: string) {
    const upload = await this.uploadRepository.findOneByCondition({
      filter: `slug||$eq||${slug}`,
    });

    if (!upload) {
      throw new FileNotFoundException(
        `File with slug '${slug}' not found. Please check the slug or try uploading the file again.`
      );
    }

    return upload;
  }

  async loadResource(slug: string) {
    const upload = await this.findBySlug(slug);
    const filePath = join(this.uploadPath, upload.relativePath);

    try {
      await fs.access(filePath);
      return filePath;
    } catch (error) {
      throw new FileNotFoundException(
        `The file corresponding to slug '${slug}' could not be found at '${filePath}'. Please ensure the file exists.`
      );
    }
  }

  async deleteBySlug(slug: string) {
    const upload = await this.findBySlug(slug);

    if (!upload) {
      throw new FileNotFoundException(
        `File with Slug '${slug}' not found. It might have already been deleted.`
      );
    }

    const filePath = join(this.uploadPath, upload.relativePath);

    try {
      await fs.unlink(filePath);
      await this.uploadRepository.delete(upload.id);
      return upload;
    } catch (error: any) {
      throw new StorageBadRequestException(
        `Failed to delete file with slug '${slug}': ${error.message}`
      );
    }
  }

  async duplicate(id: number) {
    const originalUpload = await this.uploadRepository.findById(id);

    if (!originalUpload) {
      throw new FileNotFoundException(
        `File with ID '${id}' not found. The original file might have been deleted.`
      );
    }

    const newSlug = uuidv4();
    const originalFilePath = join(this.uploadPath, originalUpload.relativePath);
    const fileExtension = mime.extension(originalUpload.mimetype) || "";
    const newRelativePath = `${newSlug}.${fileExtension}`;
    const newFilePath = join(this.uploadPath, newRelativePath);

    try {
      await fs.copyFile(originalFilePath, newFilePath);
    } catch (error: any) {
      throw new StorageBadRequestException(
        `Failed to duplicate file with ID '${id}': ${error.message}`
      );
    }

    const duplicatedUpload = await this.uploadRepository.create({
      slug: newSlug,
      filename: originalUpload.filename,
      mimetype: originalUpload.mimetype,
      size: originalUpload.size,
      relativePath: newRelativePath,
    });

    return duplicatedUpload;
  }

  async getTotal() {
    const count = await this.uploadRepository.count();
    return count;
  }
}
