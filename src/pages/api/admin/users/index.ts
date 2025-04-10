import { NextApiRequest, NextApiResponse } from "next";
import container from "@/lib/container";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userService = container.UserService;
  try {
    switch (req.method) {
      case "GET": {
        const users = await userService.getAllUsers(req.query);
        return res.status(200).json(users);
      }
      case "POST": {
        const user = await userService.createUser(req.body);
        return res.status(201).json({
          message: "User Created Successfully",
          code: 200,
          data: user,
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
