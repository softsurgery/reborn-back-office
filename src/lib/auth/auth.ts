import { UserService } from "@/lib/users-management/services/user.service";
import { comparePasswords } from "@/lib/utils/hash.util";
import crypto from "crypto";
import { addMinutes } from "date-fns";
import { SigninPayload, User } from "@/types";
import jwt from "jsonwebtoken";
import { ResetTokenService } from "../users-management/services/reset-token.service";
import { MailService } from "../mail/services/mail.service";

export class AuthService {
  private userService: UserService;
  private resetTokenService: ResetTokenService;
  private mailService: MailService;

  constructor(
    userService: UserService,
    restTokenService: ResetTokenService,
    mailService: MailService
  ) {
    this.userService = userService;
    this.resetTokenService = restTokenService;
    this.mailService = mailService;
  }

  private generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const secret = process.env.JWT_SECRET as string;
    const accessExp =
      (process.env.JWT_ACCESS_EXPIRATION as jwt.SignOptions["expiresIn"]) ??
      "15m";
    const refreshExp =
      (process.env.JWT_REFRESH_EXPIRATION as jwt.SignOptions["expiresIn"]) ??
      "7d";

    const accessToken = jwt.sign(payload, secret, {
      expiresIn: accessExp,
    });

    const refreshToken = jwt.sign(payload, secret, {
      expiresIn: refreshExp,
    });

    return { accessToken, refreshToken };
  }

  async signin(payload: SigninPayload) {
    if (!payload.usernameOrEmail || !payload.password) {
      throw new Error("Please enter both your email/username and password");
    }

    const user = await this.userService.getUserByCondition({
      filter: `(username||$eq||${payload.usernameOrEmail};email||$eq||${payload.usernameOrEmail})`,
    });

    if (!user) {
      throw new Error("No account found with that email or username");
    }

    const isMatch =
      user.password &&
      (await comparePasswords(payload.password, user.password));

    if (!isMatch) {
      throw new Error("The password you entered is incorrect");
    }

    const { accessToken, refreshToken } = this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const secret = process.env.JWT_SECRET as string;

    try {
      const decoded = jwt.verify(refreshToken, secret) as jwt.JwtPayload;

      const user = await this.userService.getUserById(decoded.sub as string);
      if (!user) {
        throw new Error("User not found.");
      }

      const { accessToken, refreshToken: newRefreshToken } =
        this.generateTokens(user);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      throw new Error("Invalid or expired refresh token.");
    }
  }

  async requestPasswordReset(usernameOrEmail: string) {
    const user = await this.userService.getUserByEmailOrUsername(
      usernameOrEmail
    );
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = addMinutes(new Date(), 15);

      await this.resetTokenService.createResetToken({
        userId: user.id,
        token,
        expires,
      });

      const resetUrl = `${process.env.NEXTAUTH_URL}/auth?target=reset-password&token=${token}`;
      if (user.email) {
        await this.mailService.sendTemplate(
          user?.email,
          "Password Reset Request",
          "forget-password",
          {
            username: user.username,
            resetUrl,
          }
        );
      }
    }
  }

  async getUserByResetToken(token: string) {
    const resetToken = await this.resetTokenService.getValidResetToken(token);
    if (!resetToken) {
      throw new Error("Invalid or expired reset token");
    }
    const user = await this.userService.getUserById(resetToken.userId);
    if (!user) {
      throw new Error("User not found for this reset token");
    }
    return user;
  }
}
