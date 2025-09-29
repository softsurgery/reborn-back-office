import React from "react";
import { BadgeCheck, Bell, CreditCard, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/content/User/useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useTranslation } from "react-i18next";

interface UserNavProps {
  className?: string;
}

export function UserNav({ className }: UserNavProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { user } = useCurrentUser();

  const identity = React.useMemo(() => identifyUser(user), [user]);
  const avatarIdentity = React.useMemo(() => identifyUserAvatar(user), [user]);

  const { data: profilePicture } = useQuery({
    queryKey: ["profile-picture", user?.profile?.pictureId],
    queryFn: () => api.upload.getUploadById(user?.profile?.pictureId!),
    enabled: !!user?.profile?.pictureId,
    staleTime: Infinity,
  });

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(className)}>
        <Avatar className="h-8 w-8 rounded-full">
          <AvatarImage src={profilePicture} alt={identity} />
          <AvatarFallback>{avatarIdentity}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={"bottom"}
        align="center"
        sideOffset={10}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={profilePicture} alt={identity} />
              <AvatarFallback className="rounded-lg">
                {avatarIdentity}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{identity}</span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User />
            {t("common.buttons.profile")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            {t("common.buttons.account")}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            {t("common.buttons.billing")}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            {t("common.buttons.notifications")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut />
          {t("common.buttons.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
