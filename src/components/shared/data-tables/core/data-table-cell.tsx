import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableCellVariant } from "@/types";
import { cn } from "@/lib/utils";

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
      <div className={cn("p-2", className)}>
        <Avatar>
          <AvatarImage src={value || "https://github.com/shadcn.png"} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    );
  }
}
