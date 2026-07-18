import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const getScrollParent = (node: HTMLElement | null): HTMLElement | null => {
  if (!node) return null;
  let current: HTMLElement | null = node.parentElement;
  while (
    current &&
    current !== document.body &&
    current !== document.documentElement
  ) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY;
    if (
      overflowY === "auto" ||
      overflowY === "scroll" ||
      overflowY === "overlay"
    ) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
};

export interface UseInfiniteScrollOptions {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  threshold = 0.1,
  rootMargin = "300px",
}: UseInfiniteScrollOptions) => {
  const triggerRef = React.useRef<HTMLDivElement | null>(null);
  const latestProps = React.useRef({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  React.useEffect(() => {
    latestProps.current = { hasNextPage, isFetchingNextPage, fetchNextPage };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const checkAndFetch = React.useCallback(() => {
    const { hasNextPage, isFetchingNextPage, fetchNextPage } =
      latestProps.current;
    if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
      fetchNextPage();
    }
  }, []);

  React.useEffect(() => {
    const element = triggerRef.current;
    if (!element || !hasNextPage) return;

    const scrollParent = getScrollParent(element);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          checkAndFetch();
        }
      },
      {
        root: scrollParent,
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    const handleScroll = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const parentBottom = scrollParent
        ? scrollParent.getBoundingClientRect().bottom
        : window.innerHeight;

      if (rect.top - parentBottom <= 300) {
        checkAndFetch();
      }
    };

    const target = scrollParent || window;
    target.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      target.removeEventListener("scroll", handleScroll);
    };
  }, [hasNextPage, threshold, rootMargin, checkAndFetch]);

  React.useEffect(() => {
    if (!isFetchingNextPage && hasNextPage && triggerRef.current) {
      const scrollParent = getScrollParent(triggerRef.current);
      const rect = triggerRef.current.getBoundingClientRect();
      const parentBottom = scrollParent
        ? scrollParent.getBoundingClientRect().bottom
        : window.innerHeight;
      if (rect.top - parentBottom <= 300) {
        checkAndFetch();
      }
    }
  }, [isFetchingNextPage, hasNextPage, checkAndFetch]);

  return { triggerRef };
};

export interface InfiniteScrollTriggerProps extends UseInfiniteScrollOptions {
  className?: string;
  loadingContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

export const InfiniteScrollTrigger: React.FC<InfiniteScrollTriggerProps> = ({
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  threshold = 0.1,
  rootMargin = "300px",
  className,
  loadingContent,
  endContent,
}) => {
  const { t } = useTranslation("common");
  const { triggerRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold,
    rootMargin,
  });

  if (!hasNextPage && !isFetchingNextPage) {
    return endContent ? (
      <div className={cn("w-full py-4 text-center", className)}>
        {endContent}
      </div>
    ) : null;
  }

  return (
    <div
      ref={triggerRef}
      className={cn(
        "w-full flex items-center justify-center py-8 mt-4",
        className,
      )}
    >
      {isFetchingNextPage ? (
        loadingContent || (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>{t("common.table.loadingMore", "Loading more...")}</span>
          </div>
        )
      ) : (
        <span className="text-xs text-transparent select-none">.</span>
      )}
    </div>
  );
};
