// pages/api/auth/forgot-password.ts
import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { emailOrUsername } = req.body;
  const authService = container.AuthService;
  try {
    if (!emailOrUsername) {
      return res
        .status(400)
        .json({ error: "Email or username is required", code: 400 });
    }
    await authService.requestPasswordReset(emailOrUsername);
    return res.status(200).json({
      message: "Password reset email sent, Please check your e-mail",
      code: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({
      error: errorMessage,
      code: 500,
      details: error,
    });
  }
}
