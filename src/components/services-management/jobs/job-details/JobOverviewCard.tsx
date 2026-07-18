import React from "react";
import {
  Layers,
  Calendar,
  Sparkles,
  CheckCircle2,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ResponseJobDto } from "@/types";

interface JobOverviewCardProps {
  job: ResponseJobDto | any | null;
  uploadsCount?: number;
}

export const JobOverviewCard = ({
  job,
  uploadsCount = 0,
}: JobOverviewCardProps) => {
  return (
    <Card>
      <CardHeader className="border-b border-border/50">
        <CardTitle className="text-sm font-black uppercase tracking-wider text-foreground">
          Job Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
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
              <CheckCircle2 className="w-4 h-4 text-primary" /> Pricing Type
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
              <ImageIcon className="w-4 h-4 text-primary" /> Photos Attached
            </span>
            <span className="font-bold text-foreground">
              {uploadsCount} {uploadsCount === 1 ? "photo" : "photos"}
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
  );
};
