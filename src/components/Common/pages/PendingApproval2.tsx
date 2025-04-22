import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

interface StillPendingProps {
  className?: string;
}

export default function StillPending({ className }: StillPendingProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 h-screen flex items-center justify-center",
        className
      )}
    >
      <div className="mx-auto max-w-screen-sm text-center">
        <h1 className="mb-4 text-6xl tracking-tight font-extrabold lg:text-7xl">
          Still Pending
        </h1>
        <p className="mb-4 text-2xl tracking-tight font-bold md:text-3xl">
          Your account is still awaiting admin approval.
        </p>
        <p className="mb-4 text-lg font-light">
          Hang tight — we&apos;ll notify you as soon as it&apos;s approved.
        </p>
        <Button
          onClick={() => router.push("/auth")}
          className="inline-flex font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4"
        >
          Back to Authentication Page
        </Button>
      </div>
    </div>
  );
}
