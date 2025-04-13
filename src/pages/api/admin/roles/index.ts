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
        const role = await roleService.createRole(req.body);
        return res.status(200).json({
          message: "Role Created Successfully",
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
