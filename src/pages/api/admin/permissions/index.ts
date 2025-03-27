import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const permissionService = container.PermissionService;
  try {
    switch (req.method) {
      case "GET": {
        const permissions = await permissionService.getAllPermissions(req.query);
        return res.status(200).json(permissions);
      }
      case "POST": {
        const permission = await permissionService.createPermission(req.body);
        return res.status(201).json(permission);
      }
      default:
        return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}
