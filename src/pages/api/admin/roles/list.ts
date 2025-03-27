import { NextApiRequest, NextApiResponse } from "next";
import container from "@/lib/container";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const roleService = container.RoleService;
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const permissions = await roleService.getPaginatedRoles(req.query);
    return res.status(200).json(permissions);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error });
  }
}
