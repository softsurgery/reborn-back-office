import { NextApiRequest, NextApiResponse } from "next";
import container from "@/lib/container";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userService = container.UserService;

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    switch (req.method) {
      case "GET": {
        const user = await userService.getUserById(id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
      }
      case "PUT": {
        const updatedUser = await userService.updateUser(id, req.body);
        return res.status(200).json(updatedUser);
      }
      case "DELETE": {
        await userService.deleteUser(id);
        return res.status(204).end();
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
