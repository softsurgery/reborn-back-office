import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

interface ContentSectionProps {
  className?: string;
  title: string;
  desc: string;
  children: JSX.Element;
}

export default function ContentSection({
  className,
  title,
  desc,
  children,
}: ContentSectionProps) {
  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <div className="flex-none">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <Separator className="my-4 flex-none" />
      <div className="flex flex-col flex-1 overflow-hidden scroll-smooth px-4 faded-bottom">
        {children}
      </div>
    </div>
  );
}
