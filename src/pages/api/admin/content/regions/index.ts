import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const regionService = container.RegionService;
  try {
    switch (req.method) {
      case "GET": {
        const regions = await regionService.getAllRegions(
          req.query
        );
        return res.status(200).json(regions);
      }
      case "POST": {
        const region = await regionService.createRegion(req.body);
        return res.status(201).json(region);
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
