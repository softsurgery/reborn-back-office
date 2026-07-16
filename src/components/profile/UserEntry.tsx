import React from "react";
import { useRouter } from "next/navigation";
import { useServerImages } from "@/hooks/content/useServerImages";
import { cn } from "@/lib/utils";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import { ResponseUserDto } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserEntryProps {
  className?: string;
  user: ResponseUserDto;
  closeDialog?: () => void;
}

export const UserEntry = ({ className, user, closeDialog }: UserEntryProps) => {
  const router = useRouter();

  const { uploads: [profilePicture] } = useServerImages({
    ids: [user?.pictureId],
    enabled: !!user?.pictureId,
  });

  const fallback = React.useMemo(() => identifyUserAvatar(user), [user]);

  const handleClick = () => {
    router.push(`/user-management/users/${user.id}`);
    closeDialog?.();
  };

  return (
    <div
      className={cn(
        "p-2 hover:bg-secondary/10 rounded-md cursor-pointer",
        className,
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Avatar className="w-10 h-10 border border-border">
            <AvatarImage src={profilePicture} alt={fallback} />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-base font-medium text-card-foreground">
              {identifyUser(user)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
