import React from "react";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "../ui/sidebar";
import { ModeToggle } from "../Common/ModeToggle";
import { LanguageSwitcher } from "../Common/LanguageSwitcher";
import { Commander } from "../Common/Commander";
import { UserNav } from "./UserNav";
import { useSession } from "next-auth/react";
import { useEmailUser } from "@/hooks/content/useEmailUser";
import { identifyUser, identifyUserAvatar } from "@/lib/users-management/utils/identify-user.util";

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const { data: userData } = useSession();
  const { user } = useEmailUser(userData?.user.email);
  const identity = React.useMemo(() => identifyUser(user), [user]);
  const avatarIdentity = React.useMemo(() => identifyUserAvatar(user), [user]);

  return (
    <header
      className={cn(
        "flex h-14 items-center gap-2 border-b px-4 lg:h-[60px] lg:px-6 w-full",
        className
      )}
    >
      <SidebarTrigger />
      <Commander />
      <div className="flex justify-center items-center gap-4 ml-auto">
        <LanguageSwitcher />
        <ModeToggle />
        <UserNav
          user={{
            name: identity,
            email: userData?.user.email || "",
            avatar: "/avatars/shadcn.jpg",
            avataralt: avatarIdentity,
          }}
        />
      </div>
    </header>
  );
};
