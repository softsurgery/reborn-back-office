// pages/api/permission/[id].ts
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
          return res.status(404).json({ error: "Role not found", code: 404 });
        }
        return res.status(200).json(role);
      }
      case "PUT": {
        const updatedRole = await roleService.updateRole(Number(id), req.body);
        return res.status(200).json({
          message: "Role Updated Successfuly",
          code: 200,
          data: updatedRole,
        });
      }
      case "DELETE": {
        const role = await roleService.deleteRole(Number(id));
        return res.status(200).json({
          message: "Role Deleted Successfully",
          code: 200,
          data: role,
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
