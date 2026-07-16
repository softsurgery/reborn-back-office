import React from "react";
import { cn } from "@/lib/utils";
import { Table as TableIcon, LayoutGrid } from "lucide-react";

export type JobViewMode = "table" | "grid";

interface ViewButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: JobViewMode;
}

interface FloatingViewSwitcherProps {
  className?: string;
  viewMode: JobViewMode;
  onChange: (mode: JobViewMode) => void;
}

export const FloatingViewSwitcher: React.FC<FloatingViewSwitcherProps> = ({
  className,
  viewMode,
  onChange,
}) => {
  const buttons: ViewButtonProps[] = [
    {
      icon: TableIcon,
      label: "Table",
      value: "table",
    },
    {
      icon: LayoutGrid,
      label: "Grid",
      value: "grid",
    },
  ];
  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1.5 rounded-lg bg-background/90 dark:bg-card/90 backdrop-blur-xl border border-border/80 shadow-sm hover:shadow-primary/15 transition-all duration-300 animate-in fade-in zoom-in-95",
        className,
      )}
    >
      {buttons.map((button) => (
        <button
          key={button.value}
          type="button"
          onClick={() => onChange(button.value)}
          className={cn(
            "flex items-center gap-1.5 p-2 rounded-lg text-xs transition-all duration-200 select-none",
            viewMode === button.value
              ? "bg-primary text-primary-foreground font-medium shadow-md scale-[1.02]"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/70 font-medium",
          )}
        >
          <button.icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};
