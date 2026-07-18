import React from "react";
import { MapPin } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { AbstractGoogleMap } from "@/components/shared/maps/AbstractGoogleMap";
import { ResponseJobDto } from "@/types";

interface JobLocationCardProps {
  job: ResponseJobDto | any | null;
}

export const JobLocationCard = ({ job }: JobLocationCardProps) => {
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

  return (
    <Card>
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-black text-foreground tracking-tight">
              Job Location
            </CardTitle>
            <CardDescription className="text-xs">
              {job?.postedBy?.region?.label
                ? `Region: ${job.postedBy.region.label}`
                : "Geographic location details"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
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
  );
};
