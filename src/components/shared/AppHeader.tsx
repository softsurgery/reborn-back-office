import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, LucideProps } from "lucide-react";
import { Text } from "../ui/text";

type IconProps = LucideProps & {
  icon: LucideIcon; 
  size?: number;
  className?: string;
};

const Icon = ({ icon: IconComponent, size = 32, className, ...props }: IconProps) => {
  return (
    <div className={cn(className)}>
      <IconComponent size={size} {...props} />
    </div>
  );
};


type Shortcut =
  | {
      icon: LucideIcon;
      onPress: () => void;
    }
  | React.ReactNode;


interface ApplicationHeaderProps {
  className?: string;
  title: string;
  shortcuts?: Shortcut[];
}


export const ApplicationHeader = ({
  className,
  title,
  shortcuts,
}: ApplicationHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-row justify-between items-center gap-2 px-2",
        className
      )}
    >
      <Text variant="h1">{title}</Text>
      <div className="flex flex-row gap-2">
        {shortcuts?.map((shortcut, index) => {
          if (
            shortcut !== null &&
            typeof shortcut === "object" &&
            "icon" in shortcut
          ) {
            return (
              <button
                key={index}
                onClick={shortcut.onPress}
                className="p-1 rounded hover:bg-gray-200 transition"
              >
                <Icon icon={shortcut.icon} size={28} />
              </button>
            );
          }
          return shortcut;
        })}
      </div>
    </div>
  );
};
