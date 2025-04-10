import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const deviceInfoService = container.DeviceInfoService;
  try {
    switch (req.method) {
      case "GET": {
        const deviceInfos = await deviceInfoService.getAllDeviceInfos(req.query);
        return res.status(200).json(deviceInfos);
      }
      case "POST": {
        const deviceInfo = await deviceInfoService.createDeviceInfo(req.body);
        return res.status(200).json({
          message: "Bug Created Successfully",
          code: 200,
          data: deviceInfo,
        });
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
