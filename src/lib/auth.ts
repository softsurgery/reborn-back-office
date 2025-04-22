import { UserService } from "@/lib/users-management/services/user.service";
import { comparePasswords } from "@/lib/utils/hash.util";
import { SigninPayload, User } from "@/types";
import jwt from "jsonwebtoken";

export class AuthService {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
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
}
