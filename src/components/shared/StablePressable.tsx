import React from "react";
import { cn } from "@/lib/utils";

interface StablePressableProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  onPressClassname?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}

export const StablePressable: React.FC<StablePressableProps> = ({
  className,
  onPressClassname,
  onPress,
  children,
  ...props
}) => {
  const [pressed, setPressed] = React.useState(false);

  return (
    <button
      className={cn(
        "rounded-lg transition-colors",
        className,
        pressed && (onPressClassname || "bg-gray-200")
      )}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onPress}
      {...props}
    >
      {children}
    </button>
  );
};
