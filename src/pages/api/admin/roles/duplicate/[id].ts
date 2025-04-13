import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

const roleService = container.RoleService;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID", code: 400 });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed", code: 405 });
  }

  try {
    const role = await roleService.duplicateRole(Number(id));
    return res
      .status(200)
      .json({ message: "Role Duplicated Successfully", code: 200, data: role });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", code: 500, details: error });
  }
}
