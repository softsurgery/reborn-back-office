import React from "react";
import { cn } from "@/lib/utils";
import Icon from "@/lib/Icon";
import { MessageCircleMoreIcon } from "lucide-react";
import { ResponseUserDto } from "@/types";
import { useServerImage } from "@/hooks/content/useServerImage";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";

interface UserEntryProps {
  className?: string;
  user: ResponseUserDto;
  lastMessage?: string;
  sentAt?: string;
  seen?: boolean;
  isPending?: boolean;
}

export const UserEntry = ({
  className,
  user,
  lastMessage,
  sentAt,
  seen,
  isPending,
}: UserEntryProps) => {
  const { jsx: profilePicture } = useServerImage({
    id: user?.pictureId,
    fallback: identifyUserAvatar(user),
    size: { width: 60, height: 60 },
  });

  return (
    <div
      className={cn(
        "flex justify-between items-center gap-2 w-full",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {profilePicture}
        <div className="flex flex-col justify-between">
          <span className="text-lg font-semibold">{identifyUser(user)}</span>
          <div className="flex gap-2 items-center">
            {lastMessage ? (
              <span
                className="text-xs font-semibold truncate"
                title={lastMessage}
              >
                {lastMessage.replaceAll("\n", " ").replace("  ", " ")}
              </span>
            ) : (
              <span className="text-xs font-semibold">
                You can start a conversation now
              </span>
            )}
            {lastMessage && <span className="text-xs font-thin">{sentAt}</span>}
          </div>
        </div>
      </div>

      {seen && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          <MessageCircleMoreIcon className="w-5 h-5" />
        </span>
      )}
    </div>
  );
};
