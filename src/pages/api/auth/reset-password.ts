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

    res.json({ message: "Password successfully reset", code: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", code: 500, details: error });
  }
}
