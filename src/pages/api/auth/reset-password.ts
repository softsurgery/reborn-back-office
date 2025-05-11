import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { token, password } = req.body;
    const authService = container.AuthService;
    const userService = container.UserService;
    const resetTokenService = container.ResetTokenService;

    const user = await authService.getUserByResetToken(token);
    await userService.updateUserPassword(user.id, password);
    await resetTokenService.invalidateResetToken(user.id);

    res.json({ message: "Password successfully reset, Please login again" });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ error: errorMessage, code: 500, details: error });
  }
}
