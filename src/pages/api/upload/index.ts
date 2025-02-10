import type { NextApiRequest, NextApiResponse } from "next";

interface NextApiRequestWithFile extends NextApiRequest {
  file?: Express.Multer.File;
}

import multer from "multer";
import fs from "fs";
import { promisify } from "util";
import { Upload } from "@/types/upload";
import container from "@/lib/container";

const unlinkAsync = promisify(fs.unlink);
const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequestWithFile,
  res: NextApiResponse
) {
  const uploadService = container.UploadService;

  if (req.method === "POST") {
    return handleUpload(req, res, uploadService);
  } else if (req.method === "GET") {
    return handleGetUploads(req, res, uploadService);
  } else if (req.method === "DELETE") {
    return handleDelete(req, res, uploadService);
  }

  // ✅ Handle Single File Upload
  function handleUpload(
    req: NextApiRequestWithFile,
    res: NextApiResponse,
    uploadService: any
  ) {
    upload.single("file")(req as any, res as any, async (err: any) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "File upload failed", details: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      try {
        const upload: Upload = await uploadService.store(req.file);
        return res.status(201).json(upload);
      } catch (error) {
        return res.status(500).json({ error: "File could not be saved" });
      }
    });
  }

  // ✅ Fetch All Uploads
  async function handleGetUploads(
    req: NextApiRequest,
    res: NextApiResponse,
    uploadService: any
  ) {
    try {
      const uploads = await uploadService.getAllUploads({});
      return res.status(200).json(uploads);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch uploads" });
    }
  }

  // ✅ Handle File Deletion
  async function handleDelete(
    req: NextApiRequest,
    res: NextApiResponse,
    uploadService: any
  ) {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    try {
      const deletedUpload = await uploadService.delete(Number(id));
      if (!deletedUpload) {
        return res.status(404).json({ error: "File not found" });
      }
      return res
        .status(200)
        .json({ message: "File deleted", upload: deletedUpload });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete file" });
    }
  }
}
