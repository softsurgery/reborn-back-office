import { NextApiRequest, NextApiResponse } from "next";
import container from "@/lib/container";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const storageService = container.StorageService;

  const { slug } = req.query;

  if (!slug || Array.isArray(slug)) {
    return res.status(400).json({ error: "Invalid Slug", code: 400 });
  }

  try {
    switch (req.method) {
      case "GET": {
        const upload = await storageService.findBySlug(slug);
        if (!upload) {
          return res.status(404).json({ error: "Upload not found", code: 404 });
        }
        return res.status(200).json(upload);
      }
      case "DELETE": {
        const upload = await storageService.deleteBySlug(slug);
        return res
          .status(200)
          .json({ message: "Upload Deleted Successfully", data: upload });
      }
      default:
        return res.status(405).json({ error: "Method Not Allowed", code: 405 });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", code: 500, details: error });
  }
}
