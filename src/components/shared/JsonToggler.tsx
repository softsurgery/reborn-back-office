import React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@radix-ui/react-separator";
import { ChevronDown } from "lucide-react";

interface JsonTogglerProps {
  className?: string;
  data: any;
}

export const JsonToggler = ({ className, data }: JsonTogglerProps) => {
  const [open, setOpen] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | null>(0);

  React.useEffect(() => {
    if (open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight + 10);
    } else {
      setHeight(0);
    }
  }, [open]);

  const effectiveHeight = React.useMemo(() => {
    if (open && contentRef.current) {
      return contentRef.current.scrollHeight + 10;
    }
    return 0;
  }, [open]);

  return (
    <div
      className={cn(
        "w-64 rounded-md border border-muted bg-muted/50 px-3 py-2 shadow-sm transition",
        className
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1 text-sm font-medium text-muted-foreground transition group"
      >
        <ChevronDown
          className={cn(
            "h-4 w-4 transform transition-transform duration-500",
            open && "rotate-180"
          )}
        />
        View Details
      </button>

      <div
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{ height: effectiveHeight }}
      >
        <div ref={contentRef}>
          <Separator className="my-2" />
          <ScrollArea className="rounded-md border bg-background p-2">
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap w-full">
              {JSON.stringify(data, null, 2)}
            </pre>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
