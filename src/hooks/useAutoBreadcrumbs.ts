import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { BreadcrumbRoute } from "@/contexts/BreadcrumbContext";

const CACHE_KEY = "breadcrumb_title_cache_v1";

export const cacheBreadcrumbTitle = (href: string, title: string) => {
  if (typeof window === "undefined" || !href || !title) return;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    if (cache[href] !== title) {
      cache[href] = title;
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }
  } catch (e) {
    // Ignore storage errors
  }
};

export const getCachedBreadcrumbTitle = (href: string): string | null => {
  if (typeof window === "undefined" || !href) return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    return cache[href] || null;
  } catch (e) {
    return null;
  }
};

export const useAutoBreadcrumbs = (): BreadcrumbRoute[] => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [autoRoutes, setAutoRoutes] = React.useState<BreadcrumbRoute[]>([]);

  const asPath = router?.asPath || "/";

  React.useEffect(() => {
    if (!asPath || asPath === "/") {
      setAutoRoutes([
        {
          title: t("common.sidebar.dashboard", "Dashboard"),
          href: "/dashboard",
        },
      ]);
      return;
    }

    const cleanPath = asPath.split("?")[0].split("#")[0];
    const segments = cleanPath.split("/").filter(Boolean);

    const routeDictionary: Record<string, string> = {
      dashboard: t("common.sidebar.dashboard", "Dashboard"),
      "user-management": t("common.sidebar.userManagement", "User Management"),
      users: t("common.sidebar.users", "Users"),
      roles: t("common.sidebar.roles", "Roles"),
      permissions: t("common.sidebar.permissions", "Permissions"),
      "system-reports": t("common.sidebar.systemReports", "System Reports"),
      feedbacks: t("common.sidebar.feedbacks", "Feedbacks"),
      bugs: t("common.sidebar.bugs", "Bugs"),
      deviceinfos: t("common.sidebar.devices", "Devices"),
      "content-management": t(
        "common.sidebar.contentManagement",
        "Content Management",
      ),
      resources: t("common.sidebar.resources", "Resources"),
      configurations: t("common.sidebar.configurations", "Configurations"),
      "reference-types": "Reference Types",
      "reference-parameters": "Reference Parameters",
      "audit-monitoring": t(
        "common.sidebar.auditMonitoring",
        "Audit Monitoring",
      ),
      logger: t("common.sidebar.logger", "Logger"),
      "dev-logger": t("common.sidebar.developerLogger", "Dev Logger"),
      "services-management": t(
        "common.sidebar.servicesManagement",
        "Services Management",
      ),
      jobs: t("common.sidebar.jobs", "Jobs"),
      create: t("common.create", "Create"),
      update: t("common.update", "Update"),
      details: t("common.details", "Details"),
      uploads: "Uploads",
      settings: "Settings",
      profile: "Profile",
      "bug-report": "Bug Report",
    };

    const generated: BreadcrumbRoute[] = segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");

      // 1. Check title cache
      const cachedTitle = getCachedBreadcrumbTitle(href);
      if (cachedTitle) {
        return { title: cachedTitle, href };
      }

      // 2. Check known dictionary
      const lowerSegment = segment.toLowerCase();
      if (routeDictionary[lowerSegment]) {
        return { title: routeDictionary[lowerSegment], href };
      }

      // 3. Check if UUID or ID
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          segment,
        );
      const isNumericOrLongId = /^\d+$/.test(segment) || segment.length > 20;
      if (isUuid || isNumericOrLongId) {
        // Try to get title from document if it's the current page leaf
        if (index === segments.length - 1 && typeof document !== "undefined") {
          const docTitle = document.title.replace(/\s*\|.*$/, "").trim();
          if (
            docTitle &&
            docTitle !== "Reborn Back Office" &&
            !docTitle.toLowerCase().includes("loading")
          ) {
            cacheBreadcrumbTitle(href, docTitle);
            return { title: docTitle, href };
          }
        }
        return {
          title: segment.length > 12 ? `${segment.slice(0, 8)}...` : segment,
          href,
        };
      }

      // 4. Fallback humanize (kebab-case / camelCase to Title Case)
      const humanized = segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return { title: humanized, href };
    });

    setAutoRoutes(generated);
  }, [asPath, t]);

  return autoRoutes;
};
