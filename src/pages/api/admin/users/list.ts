import { NextApiRequest, NextApiResponse } from "next";
import container from "@/lib/container";
import { withAuth } from "@/lib/auth/withAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userService = container.UserService;
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed", code: 405 });
  }
  try {
    const users = await userService.getPaginatedUsers(req.query);
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", code: 500, details: error });
  }
}

export default withAuth(["READ_USER"])(handler);
