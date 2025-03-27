import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const permissionService = container.PermissionService;
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const permissions = await permissionService.getPaginatedPermissions(req.query);
    return res.status(200).json(permissions);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error });
  }
}
