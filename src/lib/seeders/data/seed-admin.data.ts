import { hashPassword } from "../../utils/hash.util";
import { User } from "@/types";

export const seedAdminData = async (): Promise<User> => {
  const hashedPassword = await hashPassword("admin");
  return {
    username: "admin",
    email: "admin@admin.com",
    password: hashedPassword,
    roleId: "admin",
    isApproved: true,
  }as User;
};
    