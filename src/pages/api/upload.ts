// pages/api/upload.ts
import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";


export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const storageService = container.StorageService;
  if (req.method === "POST") {
    try {
      const upload = await storageService.store(req);
      res.status(200).json(upload);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }

    try {
      const deleted = await storageService.delete(Number(id));
      res.status(200).json(deleted);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
