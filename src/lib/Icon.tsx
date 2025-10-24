import * as React from "react";
import { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils"; 

type IconProps = LucideProps & {
  name: LucideIcon;
  className?: string;
  size?: number;
};

const Icon: React.FC<IconProps> = ({ name: LucideIcon, className, size = 32, ...props }) => {
  return (
    <div className={cn("inline-flex", className)}>
      <LucideIcon
        className={cn(!props.color && "text-foreground")}
        size={size}
        {...props}
      />
    </div>
  );
};

export default Icon;
