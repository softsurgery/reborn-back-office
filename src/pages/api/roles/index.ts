import { NextApiRequest, NextApiResponse } from "next";
import container from "@/lib/container";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const roleService = container.RoleService;
  try {
    switch (req.method) {
      case "GET": {
        const roles = await roleService.getAllRoles(req.query);
        return res.status(200).json(roles);
      }
      case "POST": {
        const { permissionIds, ...payload } = req.body;
        const role = await roleService.createRole(payload, permissionIds);
        return res.status(201).json(role);
      }
      default:
        return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error });
  }
}
