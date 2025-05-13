import { NextApiRequest, NextApiResponse } from "next";
import container from "@/lib/container";
import { withAuth } from "@/lib/auth/withAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userService = container.UserService;
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed", code: 405 });
  }
  try {
    const { id, permissions } = req.body;
    const granted = await userService.hasPermissions(id, permissions);
    return res.status(200).json({
      message: granted
        ? "All permissions are granted"
        : "Insufficient permissions",
      code: 200,
      data: granted,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", code: 500, details: error });
  }
}

export default withAuth()(handler);
