import { NextApiRequest, NextApiResponse } from "next";
import { createReadStream } from "fs";
import { basename } from "path";
import container from "@/lib/container";

const storageService = container.StorageService;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ message: "Slug is required" });
  }

  try {
    const filePath = await storageService.loadResource(slug);
    const fileName = basename(filePath);

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/octet-stream");

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error: any) {
    console.error(error);
    return res.status(404).json({ message: error.message || "File not found" });
  }
}
