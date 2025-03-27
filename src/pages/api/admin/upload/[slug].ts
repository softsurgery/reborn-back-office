import type { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";
import fs from "fs";
import { createReadStream } from "fs";
import container from "@/lib/container";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const uploadService = container.UploadService;

  if (req.method === "GET") {
    return handleFileDownload(req, res, uploadService, slug as string);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}

// ✅ Download File
async function handleFileDownload(
  req: NextApiRequest,
  res: NextApiResponse,
  uploadService: any,
  slug: string
) {
  try {
    const upload = await uploadService.getUploadBySlug(slug);
    if (!upload) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = join(uploadService.rootLocation, upload.relativePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on disk" });
    }

    const fileStream = createReadStream(filePath);
    res.setHeader("Content-Type", upload.mimetype);
    res.setHeader("Content-Disposition", `attachment; filename="${upload.filename}"`);
    fileStream.pipe(res);
  } catch (error) {
    return res.status(500).json({ error: "Error downloading file" });
  }
}