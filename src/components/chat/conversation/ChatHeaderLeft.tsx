import React from "react";
import { cn } from "@/lib/utils";
import { Text } from "../../ui/text";
import { StablePressable } from "@/components/shared/StablePressable";
import { ArrowLeft } from "lucide-react";

interface ChatHeaderLeftProps {
  className?: string;
  identifier?: string;
  profilePicture?: React.ReactNode;
  lastSeen?: string;
  onBack?: () => void; // callback pour revenir en arrière
}

export const ChatHeaderLeft = ({
  className,
  identifier,
  profilePicture,
  lastSeen,
  onBack,
}: ChatHeaderLeftProps) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center gap-2 my-2",
        className
      )}
    >
      {/* back button */}
      <StablePressable
        className="ml-4 mr-2 cursor-pointer"
        onPress={() => {
          if (onBack) onBack();
          else window.history.back(); // fallback
        }}
      >
        <ArrowLeft size={20} strokeWidth={3} />
      </StablePressable>

      <div>{profilePicture}</div>

      <div className="flex flex-col justify-center">
        <Text>{identifier}</Text>
        <Text className="text-xs text-gray-500">{lastSeen}</Text>
      </div>
    </div>
  );
};
