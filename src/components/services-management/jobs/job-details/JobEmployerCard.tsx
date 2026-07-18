import React from "react";
import { Building2, CheckCircle2, MapPin, ExternalLink } from "lucide-react";
import { useRouter } from "next/router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useServerImages } from "@/hooks/content/useServerImages";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import { ResponseJobDto } from "@/types";

interface JobEmployerCardProps {
  job: ResponseJobDto | any | null;
}

export const JobEmployerCard = ({ job }: JobEmployerCardProps) => {
  const router = useRouter();

  const {
    uploads: [profilePicture],
  } = useServerImages({
    ids: [job?.postedBy?.pictureId],
    enabled: !!job?.postedBy?.pictureId,
  });

  const fallback = React.useMemo(
    () => identifyUserAvatar(job?.postedBy),
    [job?.postedBy],
  );

  const handleAvatarClick = () => {
    if (job?.postedBy?.id) {
      router.push(`/user-management/users/${job.postedBy.id}`);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Building2 className="w-4 h-4" />
          </div>
          <CardTitle className="text-sm font-black uppercase tracking-wider text-foreground">
            About the Employer
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
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
  );
};
