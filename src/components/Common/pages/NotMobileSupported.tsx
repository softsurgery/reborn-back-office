import { cn } from "@/lib/utils";
import { PhoneOff } from "lucide-react";

interface NotMobileSupportedProps {
  className?: string;
}

export default function NotMobileSupported({
  className,
}: NotMobileSupportedProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-screen px-4 py-12",
        className
      )}
    >
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-extrabold text-primary-600 dark:text-primary-500 mb-4"></h1>
        <h2 className="text-2xl md:text-3xl font-bold">
          <span className="flex items-center justify-center gap-1">
            Not Available on Mobile <PhoneOff />
          </span>
        </h2>
        <p className="mb-6">
          This page or feature is designed for larger screens. Please use a
          desktop or tablet to access it.
        </p>
      </div>
    </div>
  );
}
