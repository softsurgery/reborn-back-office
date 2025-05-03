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
    const { fields, files } = await storageService.parseForm(req);

    const fileField = files.file;
    if (!fileField || (Array.isArray(fileField) && fileField.length === 0)) {
      return res.status(400).json({ error: "No file uploaded.", code: 400 });
    }

    let upload;
    if (Array.isArray(fileField)) {
      upload = await storageService.storeMultipleParsed(fields, fileField);
    } else {
      upload = await storageService.storeParsed(fields, fileField);
    }

    res.status(200).json({
      message: "Files Uploaded Successfully",
      code: 200,
      data: upload,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message, code: 500 });
  }
}
