import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const storageService = container.StorageService;
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed", code: 405 });
  }
  try {
    const upload = await storageService.store(req);
    res.status(200).json(upload);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
