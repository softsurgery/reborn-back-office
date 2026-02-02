import React from "react";
import { MapPin, Tag, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { JobDifficulty, JobStyle, ResponseRefParamDto } from "@/types";
import { useQueries, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import Image from "next/image";
import { useRouter } from "next/router";
import { timeAgo } from "@/lib/date.lib";

// Types based on the provided interface

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
  const formatPrice = (price?: number, currency?: ResponseRefParamDto) => {
    return `${currency?.extras?.symbol}${price?.toLocaleString()}`;
  };

  const { data: jobResp, isPending: isJobPending } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => api.job.findById(jobId as string),
  });

  const job = React.useMemo(() => jobResp ?? null, [jobResp]);

  const { data: profilePicture } = useQuery({
    queryKey: ["profile-picture", jobResp?.postedBy?.pictureId],
    queryFn: () => api.upload.getUploadById(jobResp?.postedBy?.pictureId!),
    enabled: !!jobResp?.postedBy?.pictureId,
    staleTime: Infinity,
  });

  const fallback = React.useMemo(
    () => identifyUserAvatar(job?.postedBy),
    [job],
  );

  const imageQueries = useQueries({
    queries: Array.isArray(uploads)
      ? uploads.map((uploadId) => ({
          queryKey: ["upload", uploadId],
          queryFn: () => api.upload.getUploadById(Number(uploadId)),
          enabled: !!uploadId,
          staleTime: Infinity,
        }))
      : [],
  });

  const getStyleBadgeColor = (style: JobStyle) => {
    switch (style) {
      case JobStyle.REMOTE:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case JobStyle.ONSITE:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case JobStyle.FLEXIBLE:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case JobStyle.FULL_TIME:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case JobStyle.DAY:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getDifficultyBadgeColor = (difficulty: JobDifficulty) => {
    switch (difficulty) {
      case JobDifficulty.ENTRY_LEVEL:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case JobDifficulty.INTERN:
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200";
      case JobDifficulty.MID_LEVEL:
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      case JobDifficulty.SENIOR_LEVEL:
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleAvatarClick = () => {
    router.push(`/user-management/users/${job?.postedBy?.id}`);
  };

  return (
    <div
      className={cn("flex flex-col flex-1 h-full container mx-auto", className)}
    >
      <div className="flex flex-col flex-1 overflow-auto gap-4 h-full">
        {/* Job Header */}
        <div className="flex flex-col gap-4 p-4 border-b">
          {/* Job Title and Price */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-balance">{job?.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-lg font-semibold text-green-600">
                {formatPrice(job?.price, job?.currency)}
              </div>
              <Badge className={getStyleBadgeColor(job?.style!)}>
                {job?.style.toLowerCase()}
              </Badge>
              <Badge variant="outline">{job?.category?.label}</Badge>
              <Badge
                variant="outline"
                className="text-gray-600 dark:text-gray-300"
              >
                {job?.difficulty.toLowerCase()}
              </Badge>
            </div>
          </div>

          {/* Tags */}
          {Array.isArray(job?.tags) && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag.label}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Job Photos */}
        <div className="px-4">
          <div
            className={cn(
              (uploads?.length ?? 0) > 0
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "hidden",
            )}
          >
            {imageQueries.map((query, index) => {
              const uploadId = uploads[index];
              if (query.isPending) {
                return (
                  <div
                    key={uploadId}
                    className="relative w-[30%] aspect-square rounded-lg overflow-hidden"
                  >
                    <Loader2 />
                  </div>
                );
              }

              if (query.isError || !query.data) {
                return null;
              }

              return (
                <div
                  key={uploadId}
                  className="relative w-[30%] aspect-square rounded-lg overflow-hidden"
                >
                  <Image
                    src={query.data}
                    alt={`Job image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    width={300}
                    height={300}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Job Description */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Job Description</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p className="whitespace-pre-wrap">{job?.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Job Stats */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-3">Job Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="font-semibold text-lg">24</div>
                <div className="text-sm text-muted-foreground">
                  Applications
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">156</div>
                <div className="text-sm text-muted-foreground">Views</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">12</div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">3</div>
                <div className="text-sm text-muted-foreground">Shares</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Poster Info Row */}
      <div className="flex items-center gap-4 p-4 border-t">
        <Avatar
          className="h-12 w-12 cursor-pointer"
          onClick={handleAvatarClick}
        >
          <AvatarImage src={profilePicture} alt={fallback} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>

        <div className="flex-1 ">
          <div className="flex items-center gap-2">
            <h3
              className="font-semibold hover:underline cursor-pointer"
              onClick={handleAvatarClick}
            >
              {identifyUser(job?.postedBy)}
            </h3>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {job?.createdAt ? timeAgo(job.createdAt) : "No Date Available"}
            </span>
          </div>
          {job?.postedBy?.region?.label && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {job?.postedBy?.region?.label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
