import { NextApiRequest, NextApiResponse } from "next";
import container from "@/lib/container";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const roleService = container.RoleService;

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    switch (req.method) {
      case "GET": {
        const role = await roleService.getRoleById(Number(id));
        if (!role) {
          return res.status(404).json({ error: "Role not found" });
        }
        return res.status(200).json(role);
      }
      case "PUT": {
        const { permissionIds, ...payload } = req.body;
        const updatedRole = await roleService.updateRole(Number(id), payload, permissionIds);
        return res.status(200).json(updatedRole);
      }
      case "DELETE": {
        await roleService.deleteRole(Number(id));
        return res.status(204).end();
      }
      default:
        return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}
