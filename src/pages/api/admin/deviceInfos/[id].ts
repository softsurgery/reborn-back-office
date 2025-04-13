import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const deviceInfoService = container.DeviceInfoService;
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    switch (req.method) {
      case "GET": {
        const deviceInfo = await deviceInfoService.getDeviceInfoById(Number(id));
        if (!deviceInfo) {
          return res.status(404).json({ error: "DeviceInfo not found", code: 404 });
        }
        return res.status(200).json(deviceInfo);
      }
      case "PUT": {
        const updatedDeviceInfo = await deviceInfoService.updateDeviceInfo(Number(id), req.body);
        return res.status(200).json({
          message: "DeviceInfo updated successfully",
          code: 200,
          data: updatedDeviceInfo,
        });
      }
      case "DELETE": {
        const deletedDeviceInfo = await deviceInfoService.deleteDeviceInfo(Number(id));
        return res.status(200).json({
          message: "DeviceInfo deleted successfully",
          code: 200,
          data: deletedDeviceInfo,
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
