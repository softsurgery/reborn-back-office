import React from "react";
import {
  MapPin,
  Tag,
  ArrowLeft,
  Calendar,
  Layers,
  Eye,
  ThumbsUp,
  Share2,
  Users,
  Sparkles,
  Building2,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { JobDifficulty, JobStyle, ResponseRefParamDto } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useServerImages } from "@/hooks/content/useServerImages";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useUi } from "@/contexts/UiContext";
import { useIntro } from "@/contexts/IntroContext";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { ImageCarousel } from "@/components/shared/ImageCarousel";
import { AbstractGoogleMap } from "@/components/shared/maps/AbstractGoogleMap";

interface JobDetailsProps {
  className?: string;
  jobId: string;
  uploads?: string[];
}

export const getStyleBadgeColor = (style?: JobStyle) => {
  switch (style) {
    case JobStyle.REMOTE:
      return "bg-green-500/15 text-green-700 dark:text-green-300 border border-green-500/30";
    case JobStyle.ONSITE:
      return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30";
    case JobStyle.FLEXIBLE:
      return "bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30";
    case JobStyle.FULL_TIME:
      return "bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30";
    case JobStyle.DAY:
      return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30";
    default:
      return "bg-gray-500/15 text-gray-700 dark:text-gray-300 border border-gray-500/30";
  }
};

export const getDifficultyBadgeColor = (difficulty?: JobDifficulty) => {
  switch (difficulty) {
    case JobDifficulty.ENTRY_LEVEL:
      return "bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30";
    case JobDifficulty.INTERN:
      return "bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30";
    case JobDifficulty.MID_LEVEL:
      return "bg-pink-500/15 text-pink-700 dark:text-pink-300 border border-pink-500/30";
    case JobDifficulty.SENIOR_LEVEL:
      return "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30";
    default:
      return "bg-gray-500/15 text-gray-700 dark:text-gray-300 border border-gray-500/30";
  }
};

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

  const {
    uploads: [profilePicture],
  } = useServerImages({
    ids: [jobResp?.postedBy?.pictureId],
    enabled: !!jobResp?.postedBy?.pictureId,
  });

  const fallback = React.useMemo(
    () => identifyUserAvatar(job?.postedBy),
    [job],
  );

  const activeUploads = React.useMemo(() => {
    if (Array.isArray(uploads) && uploads.length > 0)
      return uploads.map(String);
    if (job?.uploads && Array.isArray(job.uploads)) {
      return [...job.uploads]
        .sort((a, b) => a.order - b.order)
        .map((u) => String(u.uploadId));
    }
    return [];
  }, [uploads, job?.uploads]);

  const { uploads: imageUploads, isPending: isImagesPending } = useServerImages(
    {
      ids: activeUploads.map((id) => Number(id)),
      enabled: activeUploads.length > 0,
    },
  );

  const validImages = React.useMemo(() => {
    return imageUploads
      .map((url, idx) => ({
        url: url || "",
        id: activeUploads[idx],
        isPending: isImagesPending,
        isError: !url && !isImagesPending,
      }))
      .filter((img) => !img.isError && Boolean(img.url));
  }, [imageUploads, activeUploads, isImagesPending]);

  const hasValidCoordinates = React.useMemo(() => {
    return (
      job?.latitude !== undefined &&
      job?.longitude !== undefined &&
      job.latitude !== null &&
      job.longitude !== null &&
      !isNaN(Number(job.latitude)) &&
      !isNaN(Number(job.longitude))
    );
  }, [job?.latitude, job?.longitude]);

  const handleAvatarClick = () => {
    if (job?.postedBy?.id) {
      router.push(`/user-management/users/${job.postedBy.id}`);
    }
  };

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
    return (
      <div
        className={cn(
          "flex flex-col flex-1 p-6 space-y-6 max-w-6xl mx-auto w-full",
          className,
        )}
      >
        <Skeleton className="h-10 w-40 rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4 rounded-2xl" />
          <div className="flex gap-3">
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-64 lg:col-span-1 rounded-2xl" />
        </div>
      </div>
    );
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
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold flex items-center gap-2 text-foreground">
            <ImageIcon className="w-5 h-5 text-primary" />
            Job Photos ({activeUploads.length})
          </h2>
        </div>

        <ImageCarousel
          images={validImages}
          isLoading={isImagesPending && activeUploads.length > 0}
          heightClassName="h-[320px] md:h-[480px]"
          emptyTitle="No photos attached to this job"
          emptyDescription="The employer has not uploaded any pictures for this listing yet."
        />
      </div>

      {/* Two-Column Details & Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Description & Tags & Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description Card */}
          <Card className="rounded-3xl border-border/80 bg-card/80 dark:bg-card/90 backdrop-blur-xl shadow-lg overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border/50">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-foreground tracking-tight">
                    Job Description
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Detailed breakdown and requirements
                  </p>
                </div>
              </div>

              <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed">
                <p className="whitespace-pre-wrap font-normal text-foreground/90">
                  {job?.description}
                </p>
              </div>

              {/* Tags Section */}
              {Array.isArray(job?.tags) && job.tags.length > 0 && (
                <div className="pt-6 border-t border-border/50 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-primary" /> Required Skills
                    & Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-accent/50 text-accent-foreground border border-border/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200 shadow-sm"
                      >
                        <Tag className="w-3 h-3 opacity-70" />
                        {tag.label?.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Location Card */}
          <Card className="rounded-3xl border-border/80 bg-card/80 dark:bg-card/90 backdrop-blur-xl shadow-lg overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-foreground tracking-tight">
                      Job Location
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {job?.postedBy?.region?.label
                        ? `Region: ${job.postedBy.region.label}`
                        : hasValidCoordinates
                          ? `Coordinates: ${job.latitude}, ${job.longitude}`
                          : "Geographic location details"}
                    </p>
                  </div>
                </div>
                {hasValidCoordinates && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    <MapPin className="w-3.5 h-3.5" />
                    {Number(job.latitude).toFixed(4)},{" "}
                    {Number(job.longitude).toFixed(4)}
                  </span>
                )}
              </div>

              {hasValidCoordinates ? (
                <div className="w-full h-[360px] md:h-[420px] rounded-2xl overflow-hidden border border-border/80 shadow-md">
                  <AbstractGoogleMap
                    marker={{
                      lat: Number(job!.latitude),
                      lng: Number(job!.longitude),
                    }}
                    center={{
                      lat: Number(job!.latitude),
                      lng: Number(job!.longitude),
                    }}
                    zoom={15}
                    height="100%"
                    interactive={true}
                    showSearch={false}
                    showClear={false}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-full h-[220px] rounded-2xl border border-dashed border-border/80 bg-muted/30 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                  <MapPin className="w-10 h-10 text-muted-foreground/40 mb-3" />
                  <span className="font-semibold text-sm text-foreground">
                    No precise coordinates specified
                  </span>
                  <span className="text-xs text-muted-foreground/80 mt-1 max-w-sm">
                    {job?.postedBy?.region?.label
                      ? `This job is located in ${job.postedBy.region.label}, but exact map coordinates were not provided by the employer.`
                      : "The employer has not set exact map coordinates for this job listing."}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metrics & Engagement Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-card/80 dark:bg-card/90 border border-border/80 shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center group">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 mb-2 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-foreground">24</span>
              <span className="text-xs font-semibold text-muted-foreground mt-0.5">
                Applications
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-card/80 dark:bg-card/90 border border-border/80 shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center group">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 mb-2 group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-foreground">156</span>
              <span className="text-xs font-semibold text-muted-foreground mt-0.5">
                Views
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-card/80 dark:bg-card/90 border border-border/80 shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center group">
              <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-500 mb-2 group-hover:scale-110 transition-transform">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-foreground">
                {likeCount}
              </span>
              <span className="text-xs font-semibold text-muted-foreground mt-0.5">
                Likes
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-card/80 dark:bg-card/90 border border-border/80 shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center group">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 mb-2 group-hover:scale-110 transition-transform">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-foreground">3</span>
              <span className="text-xs font-semibold text-muted-foreground mt-0.5">
                Shares
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Employer & Overview Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* About Employer Card */}
          <Card className="rounded-3xl border-border/80 bg-card/80 dark:bg-card/90 backdrop-blur-xl shadow-lg overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border/50">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                  About the Employer
                </h3>
              </div>

              {job?.postedBy ? (
                <div className="flex flex-col items-center text-center space-y-3">
                  <Avatar
                    className="h-20 w-20 border-4 border-primary/20 shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={handleAvatarClick}
                  >
                    <AvatarImage
                      src={profilePicture as string}
                      alt={fallback}
                    />
                    <AvatarFallback className="text-lg bg-primary/10 text-primary font-black">
                      {fallback}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div
                      className="text-lg font-black text-foreground hover:text-primary hover:underline cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                      onClick={handleAvatarClick}
                    >
                      {identifyUser(job.postedBy)}
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    </div>

                    {job.postedBy.region?.label && (
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground font-medium">
                        <MapPin className="h-3.5 w-3.5 text-primary/80" />
                        {job.postedBy.region.label}
                      </div>
                    )}
                  </div>

                  <div className="w-full pt-4 border-t border-border/50 flex flex-col gap-2">
                    <Button
                      onClick={handleAvatarClick}
                      className="w-full rounded-xl font-bold gap-2 shadow-md hover:shadow-primary/20 transition-all duration-300"
                    >
                      View Profile <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground italic">
                  No employer information provided.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Overview Card */}
          <Card className="rounded-3xl border-border/80 bg-card/80 dark:bg-card/90 backdrop-blur-xl shadow-lg overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-foreground pb-3 border-b border-border/50">
                Job Overview
              </h3>

              <div className="space-y-3.5 text-xs font-medium">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" /> Status
                  </span>
                  <span className="font-bold text-foreground capitalize">
                    {job?.status || "Draft"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" /> Category
                  </span>
                  <span className="font-bold text-foreground">
                    {job?.category?.label || "Unknown"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Job Style
                  </span>
                  <span className="font-bold text-foreground">
                    {job?.style || "Not Specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Difficulty
                  </span>
                  <span className="font-bold text-foreground">
                    {job?.difficulty || "Not Specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Pricing
                    Type
                  </span>
                  <span className="font-bold text-foreground capitalize">
                    {job?.pricingType === "hourly"
                      ? "Hourly Rate"
                      : job?.pricingType === "fixed"
                        ? "Fixed Price"
                        : "Fixed Price"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Coordinates
                  </span>
                  <span className="font-bold text-foreground">
                    {job?.latitude !== undefined &&
                    job?.longitude !== undefined &&
                    job.latitude !== null &&
                    job.longitude !== null
                      ? `${job.latitude}, ${job.longitude}`
                      : "Not Specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" /> Photos
                    Attached
                  </span>
                  <span className="font-bold text-foreground">
                    {activeUploads.length}{" "}
                    {activeUploads.length === 1 ? "photo" : "photos"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Posted Date
                  </span>
                  <span className="font-bold text-foreground">
                    {job?.createdAt
                      ? new Date(job.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
