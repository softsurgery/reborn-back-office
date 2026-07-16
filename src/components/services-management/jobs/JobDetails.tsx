import React from "react";
import {
  MapPin,
  Tag,
  Loader2,
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
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { JobDifficulty, JobStyle, ResponseRefParamDto } from "@/types";
import { useQueries, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useServerImages } from "@/hooks/content/useServerImages";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import Image from "next/image";
import { useRouter } from "next/router";
import { timeAgo } from "@/lib/date.lib";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useUi } from "@/contexts/UiContext";

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

  const [selectedImageIdx, setSelectedImageIdx] = React.useState(0);
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
        url,
        id: activeUploads[idx],
        isPending: isImagesPending,
        isError: !url && !isImagesPending,
      }))
      .filter((img) => !img.isError && img.url);
  }, [imageUploads, activeUploads, isImagesPending]);

  React.useEffect(() => {
    if (selectedImageIdx >= validImages.length && validImages.length > 0) {
      setSelectedImageIdx(0);
    }
  }, [validImages.length, selectedImageIdx]);

  const handleAvatarClick = () => {
    if (job?.postedBy?.id) {
      router.push(`/user-management/users/${job.postedBy.id}`);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success(
        tCommon("common.toast.copiedToClipboard", "Link copied to clipboard!"),
      );
    }
  };

  const handleLikeToggle = () => {
    setHasLiked((prev) => !prev);
    setLikeCount((prev) => (hasLiked ? prev - 1 : prev + 1));
    toast.success(hasLiked ? "Removed like" : "Liked job post!");
  };

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

  const currentCover = validImages[selectedImageIdx]?.url;

  return (
    <div
      className={cn(
        "flex flex-col flex-1 pb-16 max-w-7xl mx-auto w-full overflow-y-auto overflow-x-hidden px-4 md:px-6 animate-in fade-in zoom-in-95 duration-300",
        className,
      )}
    >
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between py-4 border-b border-border/40">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/services-management/jobs")}
          className="gap-2 text-muted-foreground hover:text-foreground font-semibold rounded-xl hover:bg-muted/70 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5 rounded-xl border-border/60 hover:bg-muted/60 text-xs font-semibold shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            <Share2 className="w-3.5 h-3.5 text-primary" /> Share
          </Button>
          <Button
            variant={hasLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLikeToggle}
            className={cn(
              "gap-1.5 rounded-xl text-xs font-semibold shadow-sm hover:scale-105 active:scale-95 transition-all",
              !hasLiked && "border-border/60 hover:bg-muted/60 text-foreground",
            )}
          >
            <ThumbsUp
              className={cn("w-3.5 h-3.5", hasLiked && "fill-current")}
            />
            {likeCount}
          </Button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="">
        {/* Subtle Decorative Background Glow */}

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold bg-primary/15 text-primary uppercase tracking-wider border border-primary/25">
                <Layers className="w-3.5 h-3.5" />
                {job?.category?.label || tCommon("common.general.unknown")}
              </span>

              {job?.style && (
                <span
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold tracking-tight",
                    getStyleBadgeColor(job.style),
                  )}
                >
                  {job.style}
                </span>
              )}

              {job?.difficulty && (
                <span
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold tracking-tight",
                    getDifficultyBadgeColor(job.difficulty),
                  )}
                >
                  {job.difficulty}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tight text-balance leading-tight">
              {job?.title}
            </h1>

            {job?.postedBy && (
              <div className="flex items-center gap-3 pt-1">
                <Avatar
                  className="h-8 w-8 cursor-pointer border-2 border-primary/20 hover:scale-105 transition-transform"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage src={profilePicture as string} alt={fallback} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                    {fallback}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span
                    className="font-bold text-foreground hover:text-primary hover:underline cursor-pointer transition-colors"
                    onClick={handleAvatarClick}
                  >
                    {identifyUser(job.postedBy)}
                  </span>
                  <span>•</span>
                  <span>
                    {job.createdAt ? timeAgo(new Date(job.createdAt)) : ""}
                  </span>
                  {job?.postedBy?.region?.label && (
                    <>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium">
                        <MapPin className="w-3.5 h-3.5 text-primary/80" />
                        {job.postedBy.region.label}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 bg-secondary/30 dark:bg-muted/40 p-4 rounded-2xl border border-border/60 shrink-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Budget / Compensation
            </span>
            <div className="inline-flex items-baseline gap-1 font-black text-2xl md:text-3xl text-emerald-600 dark:text-emerald-400">
              {formatPrice(job?.price, job?.currency)}
              <span className="text-xs font-bold text-muted-foreground uppercase">
                {job?.currency?.label || ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Photo Gallery Section */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold flex items-center gap-2 text-foreground">
            <ImageIcon className="w-5 h-5 text-primary" />
            Job Photos ({activeUploads.length})
          </h2>
        </div>

        {activeUploads.length === 0 ? (
          <div className="w-full h-[220px] rounded-3xl border border-dashed border-border/80 bg-card/50 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
            <ImageIcon className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <span className="font-semibold text-sm">
              No photos attached to this job
            </span>
            <span className="text-xs text-muted-foreground/80 mt-1">
              The employer has not uploaded any pictures for this listing yet.
            </span>
          </div>
        ) : (
          <>
            <div className="relative w-full h-[320px] md:h-[480px] rounded-3xl overflow-hidden bg-card border border-border/80 shadow-2xl group">
              {validImages.length === 0 || !currentCover ? (
                <div className="w-full h-full flex items-center justify-center bg-muted/40">
                  <Loader2 className="w-10 h-10 animate-spin text-primary/60" />
                </div>
              ) : (
                <Image
                  src={currentCover}
                  alt={`Job preview ${selectedImageIdx + 1}`}
                  fill
                  unoptimized
                  className="object-contain md:object-cover bg-black/90 transition-all duration-500"
                />
              )}

              {/* Navigation Arrows for Gallery */}
              {validImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImageIdx((prev) =>
                        prev === 0 ? validImages.length - 1 : prev - 1,
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 transition-all z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImageIdx((prev) =>
                        prev === validImages.length - 1 ? 0 : prev + 1,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 transition-all z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Strip */}
            {validImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
                {validImages.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={cn(
                      "relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 transition-all duration-300 border-2",
                      selectedImageIdx === idx
                        ? "border-primary ring-4 ring-primary/20 scale-105 shadow-lg"
                        : "border-transparent opacity-60 hover:opacity-100 bg-muted",
                    )}
                  >
                    <Image
                      src={img.url!}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
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
