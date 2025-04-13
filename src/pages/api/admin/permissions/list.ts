// pages/api/permission/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import container from "@/lib/container";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const permissionService = container.PermissionService;
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed", code: 405 });
  }
  try {
    const roles = await permissionService.getPaginatedPermissions(req.query);
    return res.status(200).json(roles);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", code: 500, details: error });
  }
}
