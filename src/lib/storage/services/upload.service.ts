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
import { Upload } from "@/types";

export class StorageService {
  private uploadRepository: UploadRepository;
  private uploadPath = process.env.UPLOAD_PATH || "./uploads";

  constructor(uploadRepository: UploadRepository) {
    this.uploadRepository = uploadRepository;
  }

  async store(req: any) {
    return new Promise((resolve, reject) => {
      const form = formidable({
        uploadDir: this.uploadPath,
        keepExtensions: true,
      });

      // Parse the request
      form.parse(req, async (err, fields, files) => {
        if (err) {
          return reject(
            new StorageBadRequestException(
              "Error processing the file. " + err.message
            )
          );
        }

        const file = files.file?.[0];
        if (!file) {
          return reject(new StorageBadRequestException("No file uploaded."));
        }
        const slug = uuidv4();
        const filename = file.originalFilename || "";
        const mimetype = file.mimetype || "";
        const size = file.size;

        const extension = mime.extension(mimetype) || "";
        let relativePath = slug;

        if (extension) {
          relativePath = `${slug}.${extension}`;
        }

        const destinationFile = join(this.uploadPath, relativePath);

        try {
          await fs.mkdir(this.uploadPath, { recursive: true });
          await fs.rename(file.filepath, destinationFile);
          const upload = await this.uploadRepository.create({
            slug,
            filename,
            mimetype,
            size,
            relativePath,
          });
          resolve(upload);
        } catch (error: any) {
          reject(
            new StorageBadRequestException(
              `Failed to store file: ${error.message}`
            )
          );
        }
      });
    });
  }

  async storeMultiple(req: any) {
    return new Promise((resolve, reject) => {
      const form = formidable({
        uploadDir: this.uploadPath,
        keepExtensions: true,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return reject(
            new StorageBadRequestException("Error processing the files.")
          );
        }

        if (!files?.file) {
          return reject(new StorageBadRequestException("No files uploaded."));
        }

        try {
          const uploadedFiles = await Promise.all(
            files?.file.map(async (file: any) => {
              const slug = uuidv4();
              const filename = file.originalFilename || "";
              const mimetype = file.mimetype || "";
              const size = file.size;
              const extension = mime.extension(mimetype) || "";
              let relativePath = slug;
              if (extension) {
                relativePath = `${slug}.${extension}`;
              }
              const destinationFile = join(this.uploadPath, relativePath);
              await fs.mkdir(this.uploadPath, { recursive: true });
              await fs.rename(file.filepath, destinationFile);
              return this.uploadRepository.create({
                slug,
                filename,
                mimetype,
                size,
                relativePath,
              });
            })
          );

          resolve(uploadedFiles);
        } catch (error: any) {
          reject(
            new StorageBadRequestException(
              `Failed to store files: ${error.message}`
            )
          );
        }
      });
    });
  }

  async getPaginatedUploads(
    queryObject: IQueryObject
  ): Promise<Paginated<Upload>> {
    return this.uploadRepository.findPaginated(queryObject);
  }

  async getAllPermissions(queryObject: IQueryObject): Promise<Upload[]> {
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

  async delete(id: number) {
    const upload = await this.uploadRepository.findById(id);

    if (!upload) {
      throw new FileNotFoundException(
        `File with ID '${id}' not found. It might have already been deleted.`
      );
    }

    const filePath = join(this.uploadPath, upload.relativePath);

    try {
      await fs.unlink(filePath);
      await this.uploadRepository.delete(id);
      return upload;
    } catch (error: any) {
      throw new StorageBadRequestException(
        `Failed to delete file with ID '${id}': ${error.message}`
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
