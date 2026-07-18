import React from "react";
import { Layers, ArrowLeft, ThumbsUp, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResponseRefParamDto } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { identifyUser } from "@/lib/user.utils";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useUi } from "@/contexts/UiContext";
import { useIntro } from "@/contexts/IntroContext";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import {
  JobPhotosGallery,
  JobDescriptionCard,
  JobLocationCard,
  JobMetricsStrip,
  JobEmployerCard,
  JobOverviewCard,
  JobDetailsSkeleton,
  getStyleBadgeColor,
  getDifficultyBadgeColor,
} from "./job-details";

export { getStyleBadgeColor, getDifficultyBadgeColor };

interface JobDetailsProps {
  className?: string;
  jobId: string;
  uploads?: string[];
}

export const JobDetails = ({
  jobId,
  className,
  uploads = [],
}: JobDetailsProps) => {
  const router = useRouter();
  const { t } = useTranslation("job");
  const { t: tCommon } = useTranslation("common");

  const { setIntro, clearIntro, setFloating, clearFloating } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();

  const [hasLiked, setHasLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(12);

  const { setScrollable, clearScrollable } = useUi();
  React.useEffect(() => {
    setScrollable?.(true);
    return () => {
      clearScrollable?.();
    };
  }, [setScrollable, clearScrollable]);

  const formatPrice = (price?: number, currency?: ResponseRefParamDto) => {
    return `${currency?.extras?.symbol || ""}${price?.toLocaleString() || "0"}`;
  };

  const { data: jobResp, isPending: isJobPending } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => api.job.findById(jobId as string),
    enabled: !!jobId,
  });

  const job = React.useMemo(() => jobResp ?? null, [jobResp]);

  const activeUploadsCount = React.useMemo(() => {
    if (Array.isArray(uploads) && uploads.length > 0) return uploads.length;
    if (job?.uploads && Array.isArray(job.uploads)) return job.uploads.length;
    return 0;
  }, [uploads, job?.uploads]);

  const handleShare = React.useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success(
        tCommon("common.toast.copiedToClipboard", "Link copied to clipboard!"),
      );
    }
  }, [tCommon]);

  const handleLikeToggle = React.useCallback(() => {
    setHasLiked((prev) => !prev);
    setLikeCount((prev) => (hasLiked ? prev - 1 : prev + 1));
    toast.success(hasLiked ? "Removed like" : "Liked job post!");
  }, [hasLiked]);

  React.useEffect(() => {
    if (!job) return;

    // Set breadcrumbs
    setRoutes?.([
      { title: t("job.intro", "Services"), href: "/services-management" },
      { title: t("job.introTitle", "Jobs"), href: "/services-management/jobs" },
      {
        title: job.title || t("job.details", "Job Details"),
        href: `/services-management/jobs/${job.id || ""}`,
      },
    ]);

    // Set Intro (Title and Description)
    const introDescription = job.description
      ? job.description.length > 140
        ? `${job.description.slice(0, 140)}...`
        : job.description
      : job.category?.label
        ? `${job.category.label} • ${job.postedBy ? identifyUser(job.postedBy) : ""}`
        : t(
            "job.detailsDescription",
            "Detailed specifications, photos, and location for this job listing.",
          );

    setIntro?.(job.title || t("job.details", "Job Details"), introDescription);

    // Set Floating Object (All other details)
    setFloating?.(
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Badges */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-primary/15 text-primary uppercase tracking-wider border border-primary/25">
            <Layers className="w-3.5 h-3.5" />
            {job.category?.label || tCommon("common.general.unknown")}
          </span>

          {job.style && (
            <span
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold tracking-tight",
                getStyleBadgeColor(job.style),
              )}
            >
              {job.style}
            </span>
          )}

          {job.difficulty && (
            <span
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold tracking-tight",
                getDifficultyBadgeColor(job.difficulty),
              )}
            >
              {job.difficulty}
            </span>
          )}

          {job.status && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold tracking-tight bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
              {job.status}
            </span>
          )}
        </div>

        {/* Budget / Compensation pill */}
        <div className="inline-flex items-baseline gap-1 font-black text-base md:text-lg text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 px-3 py-1 rounded-xl border border-emerald-500/25 shadow-sm">
          {formatPrice(job.price, job.currency)}
          <span className="text-[10px] font-bold text-muted-foreground uppercase">
            {job.currency?.label || ""}
          </span>
        </div>

        {/* Share Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-1.5 rounded-xl border-border/60 hover:bg-muted/60 text-xs font-semibold shadow-sm hover:scale-105 active:scale-95 transition-all"
        >
          <Share2 className="w-3.5 h-3.5 text-primary" /> Share
        </Button>

        {/* Like Button */}
        <Button
          variant={hasLiked ? "default" : "outline"}
          size="sm"
          onClick={handleLikeToggle}
          className={cn(
            "gap-1.5 rounded-xl text-xs font-semibold shadow-sm hover:scale-105 active:scale-95 transition-all",
            !hasLiked && "border-border/60 hover:bg-muted/60 text-foreground",
          )}
        >
          <ThumbsUp className={cn("w-3.5 h-3.5", hasLiked && "fill-current")} />
          {likeCount}
        </Button>
      </div>,
    );

    return () => {
      clearIntro?.();
      clearFloating?.();
      clearRoutes?.();
    };
  }, [
    job,
    hasLiked,
    likeCount,
    setIntro,
    setFloating,
    clearIntro,
    clearFloating,
    setRoutes,
    clearRoutes,
    t,
    tCommon,
    handleShare,
    handleLikeToggle,
  ]);

  if (isJobPending) {
    return <JobDetailsSkeleton className={className} />;
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <Layers className="h-16 w-16 text-muted-foreground/40 mb-4 animate-bounce" />
        <h2 className="text-xl font-bold">
          {t("job.notfound", "Job not found")}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          The requested job listing may have been removed or is unavailable.
        </p>
        <Button
          onClick={() => router.push("/services-management/jobs")}
          className="mt-6 gap-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col flex-1 pb-16 max-w-7xl mx-auto w-full overflow-y-auto overflow-x-hidden px-4 md:px-6 animate-in fade-in zoom-in-95 duration-300",
        className,
      )}
    >
      {/* Interactive Photo Gallery Section */}
      <JobPhotosGallery job={job} uploads={uploads} />

      {/* Two-Column Details & Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Description & Tags & Stats */}
        <div className="lg:col-span-2 space-y-8">
          <JobDescriptionCard job={job} />
          <JobLocationCard job={job} />
          <JobMetricsStrip likeCount={likeCount} />
        </div>

        {/* Right Column: Employer & Overview Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <JobEmployerCard job={job} />
          <JobOverviewCard job={job} uploadsCount={activeUploadsCount} />
        </div>
      </div>
    </div>
  );
};
