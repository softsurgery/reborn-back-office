import { getToken } from "next-auth/jwt";
import container from "@/lib/container";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const secret = process.env.NEXTAUTH_SECRET;

export function withAuth(permissions: string[] = []) {
  return (handler: NextApiHandler): NextApiHandler => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const token = await getToken({ req, secret });

      if (!token || !token.sub) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      (req as any).user = token;

      if (permissions.length > 0) {
        const hasPermissions = await container.UserService.hasPermissions(token.sub, permissions);
        if (!hasPermissions) {
          return res.status(403).json({ error: "Forbidden - insufficient permissions" });
        }
      }

      return handler(req, res);
    };
  };
}
