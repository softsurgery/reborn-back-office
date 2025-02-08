import { NextApiRequest, NextApiResponse } from "next";
import container from "@/lib/container";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userService = container.UserService;
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  try {
    const user = await userService.deactivate(id);
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error });
  }
}
