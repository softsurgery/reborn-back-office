import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import React from "react";
import { DataTableCellVariant } from "../types";

interface DataTableCellProps {
  className?: string;
  value?: any;
  variant?: DataTableCellVariant;
}

export default function DataTableCell({
  className,
  variant,
  value,
}: DataTableCellProps) {
  if (variant === DataTableCellVariant.TEXT) {
    return <div className={className}>{value}</div>;
  } else if (variant === DataTableCellVariant.NUMBER) {
    return <div className={className}>{value}</div>;
  } else if (variant === DataTableCellVariant.DATE) {
    return <div className={className}>{value}</div>;
  } else if (variant === DataTableCellVariant.DATE_TIME) {
    if (!value) return <div className={className}>No Date</div>;
    return (
      <div className="flex items-start flex-col">
        <div>{value?.toLocaleDateString()}</div>
        <div className="text-muted-foreground">
          {value?.toLocaleTimeString()}
        </div>
      </div>
    );
  } else if (variant === DataTableCellVariant.AVATAR) {
    return (
      <Avatar className={cn("w-24 h-24", className)}>
        <AvatarImage src={value?.url} />
        <AvatarFallback>{value?.fallback}</AvatarFallback>
      </Avatar>
    );
  }
}
