import { NextApiRequest, NextApiResponse } from "next";
import container from "@/lib/container";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { usernameOrEmail, password } = req.body;

  try {
    const { user, accessToken, refreshToken } =
      await container.AuthService.signin({
        usernameOrEmail,
        password,
      });

    return res.status(200).json({
      message: `Successfully logged in as ${user.username}`,
      code: 200,
      data: { accessToken, refreshToken },
    });
  } catch (err: any) {
    return res.status(401).json({ error: err.message, code: 401 });
  }
}
