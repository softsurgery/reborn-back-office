import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResourcesActionBarProps {
  className?: string;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

export const ResourcesActionBar = ({
  className,
  searchTerm,
  setSearchTerm,
}: ResourcesActionBarProps) => {
  return (
    <div
      className={cn(
        "flex flex-row justify-center items-center gap-4",
        className
      )}
    >
      <Input
        placeholder="Search resources"
        className="mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm?.(e.target.value)}
      />
      <Button variant="default" className="mb-4">
        Add Resource
      </Button>
    </div>
  );
};
