import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/router";

interface BreadcrumbProps {
  className?: string;
  routes?: { title: string; href?: string }[];
}

export const Breadcrumb = ({
  className,
  routes,
}: BreadcrumbProps) => {
  const router = useRouter();
  const lastIndex = routes ? routes.length - 1 : 0;

  return (
    <ShadcnBreadcrumb className={cn(className, "my-auto")} aria-label="breadcrumb">
      <BreadcrumbList className="flex flex-wrap gap-1 sm:gap-2 items-center">
        {routes?.map((item, index) => (
          <BreadcrumbItem
            key={index}
            className="flex items-center gap-1 sm:gap-2"
          >
            {item.href ? (
              <BreadcrumbLink
                className={cn(
                  "font-semibold text-xs sm:text-sm md:text-base",
                  item.href ? "cursor-pointer" : "cursor-default"
                )}
                onClick={() => {
                  if (item.href) router.push(item.href);
                }}
              >
                {item.title}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className="font-medium text-xs sm:text-sm md:text-base">
                {item.title}
              </BreadcrumbPage>
            )}
            {index != lastIndex && (
              <ChevronRight
                className={cn("w-4 h-4 sm:w-5 sm:h-5", "text-gray-400")}
              />
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
};
