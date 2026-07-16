import React from "react";
import { useServerImages } from "@/hooks/content/useServerImages";
import { cn } from "@/lib/utils";
import { ResponseJobDto } from "@/types";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import { timeAgo } from "@/lib/date.lib";
import { getStyleBadgeColor, getDifficultyBadgeColor } from "../JobDetails";
import {
  Telescope,
  Edit,
  Trash2,
  Image as ImageIcon,
  Tag as TagIcon,
  Layers,
} from "lucide-react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";

interface JobCardProps {
  job: ResponseJobDto;
  context: DataTableConfig<ResponseJobDto>;
}

export const JobCard: React.FC<JobCardProps> = ({ job, context }) => {
  const { t } = useTranslation("job");
  const { t: tCommon } = useTranslation("common");

  const fallback = React.useMemo(
    () => identifyUserAvatar(job?.postedBy),
    [job],
  );

  const firstUploadId = React.useMemo(() => {
    if (!job.uploads || job.uploads.length === 0) return undefined;
    const sorted = [...job.uploads].sort((a, b) => a.order - b.order);
    return sorted[0]?.uploadId;
  }, [job.uploads]);

  const { uploads: [profilePicture, coverImage], isPending: isCoverPending } = useServerImages({
    ids: [job.postedBy?.pictureId, firstUploadId],
  });

  const targetAndTrigger = (callback?: Function) => {
    context.targetEntity?.(job);
    if (callback) {
      callback(job);
    }
  };

  return (
    <div className="group relative flex flex-col bg-card/80 dark:bg-card/90 backdrop-blur-md border border-border/70 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50">
      {/* Top Accent Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

      {/* Cover Image Header */}
      {firstUploadId && (
        <div
          className="relative w-full h-44 overflow-hidden bg-muted/40 cursor-pointer shrink-0"
          onClick={() => targetAndTrigger(() => context.inspectCallback?.(job))}
        >
          {isCoverPending ? (
            <div className="w-full h-full animate-pulse bg-muted flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
            </div>
          ) : coverImage ? (
            <Image
              src={coverImage}
              alt={job.title}
              width={400}
              height={300}
              unoptimized
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/60 text-white backdrop-blur-md uppercase tracking-wider shadow-sm">
              <Layers className="w-3 h-3 text-primary-foreground" />
              {job.category?.label || tCommon("common.general.unknown")}
            </span>

            {job.uploads && job.uploads.length > 1 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/60 text-white backdrop-blur-md shadow-sm">
                <ImageIcon className="w-3 h-3" />+{job.uploads.length - 1}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        {/* Header: Category (if no cover) and Action Menu */}
        <div className="flex items-center justify-between gap-2">
          {!firstUploadId ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-secondary/80 text-secondary-foreground uppercase tracking-wider">
              <Layers className="w-3 h-3 text-muted-foreground" />
              {job.category?.label || tCommon("common.general.unknown")}
            </span>
          ) : (
            <div className="flex-1" />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] font-medium">
              <DropdownMenuLabel className="text-center font-black text-xs">
                {tCommon("common.table.actions")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {context.inspectCallback && (
                <DropdownMenuItem
                  onClick={() =>
                    targetAndTrigger(() => context.inspectCallback?.(job))
                  }
                  className="cursor-pointer"
                >
                  <Telescope className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-xs">
                    {tCommon("common.buttons.inspect")}
                  </span>
                </DropdownMenuItem>
              )}

              {context.updateCallback && (
                <DropdownMenuItem
                  onClick={() =>
                    targetAndTrigger(() => context.updateCallback?.(job))
                  }
                  className="cursor-pointer"
                >
                  <Edit className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-xs">
                    {tCommon("common.buttons.edit")}
                  </span>
                </DropdownMenuItem>
              )}

              {context.deleteCallback && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      targetAndTrigger(() => context.deleteCallback?.(job))
                    }
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    <span className="text-xs">
                      {tCommon("common.buttons.delete")}
                    </span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <h3
          onClick={() => targetAndTrigger(() => context.inspectCallback?.(job))}
          className="font-bold text-base mt-2.5 line-clamp-2 text-foreground group-hover:text-primary transition-colors cursor-pointer"
          title={job.title}
        >
          {job.title}
        </h3>

        {/* Price Tag */}
        <div className="mt-2 mb-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-extrabold bg-primary/10 text-primary dark:bg-primary/20 border border-primary/20">
            {job.price?.toLocaleString()}{" "}
            {job.currency?.extras?.symbol || job.currency?.label || ""}
          </span>
        </div>

        {/* Badges: Style & Difficulty & Photos */}
        <div className="flex flex-wrap items-center gap-1.5 my-1">
          {job.style && (
            <span
              className={cn(
                "px-2 py-0.5 rounded-md text-[11px] font-medium tracking-tight",
                getStyleBadgeColor(job.style),
              )}
            >
              {job.style}
            </span>
          )}
          {job.difficulty && (
            <span
              className={cn(
                "px-2 py-0.5 rounded-md text-[11px] font-medium tracking-tight",
                getDifficultyBadgeColor(job.difficulty),
              )}
            >
              {job.difficulty}
            </span>
          )}
          {(job.uploads?.length ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground">
              <ImageIcon className="w-3 h-3" />
              {job.uploads.length}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-3 mt-2.5 flex-1 leading-relaxed">
          {job.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1 mt-3 pt-2 border-t border-border/40 min-h-[28px]">
          {job.tags && job.tags.length > 0 ? (
            <>
              {job.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/60 text-accent-foreground border border-border/40"
                >
                  <TagIcon className="w-2.5 h-2.5 opacity-60" />
                  {tag.label?.toUpperCase()}
                </span>
              ))}
              {job.tags.length > 3 && (
                <span className="text-[10px] text-muted-foreground font-semibold px-1">
                  +{job.tags.length - 3} {tCommon("common.general.more")}
                </span>
              )}
            </>
          ) : (
            <span className="text-[11px] text-muted-foreground/60 italic">
              {t("job.columns.noTags")}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Posted By and Creation Date */}
      <div className="border-t border-border/50 bg-muted/30 px-4 py-2.5 flex items-center justify-between gap-2">
        {job.postedBy ? (
          <Link
            href={`/user-management/users/${job.postedBy.id}`}
            className="flex items-center gap-2 group/user max-w-[65%]"
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar className="h-6 w-6 border border-border/60">
              <AvatarImage
                src={profilePicture as string}
                alt={identifyUser(job.postedBy)}
              />
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                {fallback}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-foreground group-hover/user:text-primary group-hover/user:underline truncate">
              {identifyUser(job.postedBy)}
            </span>
          </Link>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}

        <span className="text-[11px] text-muted-foreground shrink-0 font-medium">
          {job.createdAt ? timeAgo(new Date(job.createdAt)) : ""}
        </span>
      </div>
    </div>
  );
};
