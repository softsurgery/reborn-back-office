import { cn } from "@/lib/utils";
import Link from "next/link";

interface ForbiddenPageProps {
  className?: string;
}

export default function ForbiddenPage({ className }: ForbiddenPageProps) {
  return (
    <div
      className={cn(
        "py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6",
        className
      )}
    >
      <div className="mx-auto max-w-screen-sm text-center">
        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-yellow-500 dark:text-yellow-400">
          403
        </h1>
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
          You don&apos;t have permission to access this page.
        </p>
        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
          If you believe this is a mistake, please contact the administrator or
          go back to the homepage.
        </p>
        <Link
          href="/"
          className="inline-flex bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-yellow-900 my-4"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}
