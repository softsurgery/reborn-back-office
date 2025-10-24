import React from "react";
import { Info } from "lucide-react";
import { StablePressable } from "@/components/shared/StablePressable";
import { cn } from "@/lib/utils";

interface ChatHeaderRightProps {
  className?: string;
}

export const ChatHeaderRight = ({ className }: ChatHeaderRightProps) => {
  return (
    <StablePressable
      className={cn("mx-2 cursor-pointer", className)}
      onPress={() => {
        alert("This is supposed to be informative");
      }}
    >
      <Info size={20} />
    </StablePressable>
  );
};
