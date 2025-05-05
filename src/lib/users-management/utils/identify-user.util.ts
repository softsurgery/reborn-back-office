import { User } from "@/prisma/interfaces";

export const identifyUser = (user: User | null) => {
  if (!user) return "unknown";
  return user?.firstName && user?.lastName
    ? `${user?.firstName?.charAt(0).toUpperCase() + user?.firstName.slice(1)} ${
        user?.lastName?.charAt(0).toUpperCase() + user?.lastName.slice(1)
      }`
    : user?.username || "unknown";
};

export const identifyUserAvatar = (user: User | null) => {
  if (!user) return "?";
  return user?.firstName && user?.lastName
    ? `${user?.firstName?.charAt(0).toUpperCase()}${user?.lastName
        ?.charAt(0)
        .toUpperCase()}`
    : user?.username?.charAt(0).toUpperCase() || "?";
};
