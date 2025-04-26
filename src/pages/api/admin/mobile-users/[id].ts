// pages/api/permission/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import container from "@/lib/container";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const mobileUserService = container.MobileUserService;

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID", code: 400 });
  }

  try {
    switch (req.method) {
      case "GET": {
        const user = await mobileUserService.getMobileUserById(id);
        if (!user) {
          return res.status(404).json({ error: "App User not found", code: 404 });
        }
        return res.status(200).json(user);
      }
      case "PUT": {
        const updatedUser = await mobileUserService.updateMobileUser(id, req.body);
        return res
          .status(200)
          .json({ message: "Mobile User Updated Successfully", data: updatedUser });
      }
      case "DELETE": {
        const user = await mobileUserService.deleteMobileUser(id);
        return res
          .status(200)
          .json({ message: "Mobile User Deleted Successfully", data: user });
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
