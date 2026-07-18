import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { useAutoBreadcrumbs, cacheBreadcrumbTitle } from "@/hooks/useAutoBreadcrumbs";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export interface BreadcrumbItemType {
  title: string;
  href?: string;
}

export interface BreadcrumbCommonProps {
  className?: string;
  hierarchy?: BreadcrumbItemType[];
  n?: number;
}

export const BreadcrumbCommon = ({
  className,
  hierarchy = [],
  n = 2,
}: BreadcrumbCommonProps) => {
  const router = useRouter();
  const autoRoutes = useAutoBreadcrumbs();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const items = React.useMemo(() => {
    if (hierarchy && hierarchy.length > 0) {
      return hierarchy;
    }
    return autoRoutes;
  }, [hierarchy, autoRoutes]);

  React.useEffect(() => {
    items.forEach((item) => {
      if (item.href && item.title) {
        cacheBreadcrumbTitle(item.href, item.title);
      }
    });
  }, [items]);

  const effectiveN = React.useMemo(() => {
    const targetN = typeof n === "number" && n > 0 ? n : 2;
    if (isMobile) return Math.min(targetN, 1);
    if (isTablet) return Math.min(targetN, 2);
    return targetN;
  }, [n, isMobile, isTablet]);

  if (!items || items.length === 0) {
    return null;
  }

  const renderItemTitle = (title: string, isLast: boolean) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "truncate block max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[280px] text-xs font-semibold",
              isLast
                ? "font-bold text-foreground"
                : "text-muted-foreground hover:text-foreground transition-colors",
            )}
          >
            {title}
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs z-50">
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const renderBreadcrumbNode = (item: BreadcrumbItemType, isLast: boolean, key: React.Key) => {
    return (
      <BreadcrumbItem key={key} className="flex items-center gap-1">
        {item.href && !isLast ? (
          <BreadcrumbLink
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              if (item.href) router.push(item.href);
            }}
          >
            {renderItemTitle(item.title, false)}
          </BreadcrumbLink>
        ) : (
          <BreadcrumbPage aria-current="page">
            {renderItemTitle(item.title, true)}
          </BreadcrumbPage>
        )}
      </BreadcrumbItem>
    );
  };

  const shouldCollapse = items.length > effectiveN + 1;
  const firstRoute = items[0];
  const hiddenRoutes = shouldCollapse ? items.slice(1, items.length - effectiveN) : [];
  const lastNScreens = shouldCollapse ? items.slice(items.length - effectiveN) : items.slice(1);

  return (
    <Breadcrumb className={cn("my-auto overflow-hidden", className)} aria-label="Breadcrumb">
      <BreadcrumbList className="flex flex-nowrap items-center gap-1.5 overflow-hidden py-0.5 sm:gap-2">
        {/* Render First Route */}
        {renderBreadcrumbNode(firstRoute, items.length === 1, "first-route")}

        {/* Render Collapsed Ellipsis with Dropdown if needed */}
        {shouldCollapse && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-6 w-6 items-center justify-center rounded-sm transition-colors hover:bg-accent hover:text-accent-foreground outline-none">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-w-[240px] z-50">
                  {hiddenRoutes.map((hiddenItem, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      className="cursor-pointer text-xs font-medium truncate"
                      onClick={() => hiddenItem.href && router.push(hiddenItem.href)}
                    >
                      {hiddenItem.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}

        {/* Render Last N Screens (or remaining screens if not collapsed) */}
        {lastNScreens.map((item, index) => {
          const isLast = index === lastNScreens.length - 1;
          return (
            <React.Fragment key={`last-${index}`}>
              <BreadcrumbSeparator />
              {renderBreadcrumbNode(item, isLast, `node-${index}`)}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

