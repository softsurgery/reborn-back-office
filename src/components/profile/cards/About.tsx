import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUpload } from "@/hooks/content/useUpload";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar,
  Car,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { DocumentCard } from "./DocumentCard";

interface AboutProps {
  className?: string;
}

export const About = ({ className }: AboutProps) => {
  const userStore = useUserStore();
  const user = userStore.response;

  const { upload: officialDocument, isUploadPending: isOfficialDocPending } =
    useUpload({
      id: userStore.response?.profile?.officialDocumentId,
      enabled: Boolean(userStore.response?.profile?.officialDocumentId),
    });

  const { upload: driverLicenseDocument, isUploadPending: isDriverDocPending } =
    useUpload({
      id: userStore.response?.profile?.driverLicenseDocumentId,
      enabled: Boolean(userStore.response?.profile?.driverLicenseDocumentId),
    });

  return (
    <Card className={cn(className, "flex flex-col overflow-auto mb-5")}>
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>
          {userStore.response?.profile?.bio || "No bio available"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="space-y-6 lg:w-1/2">
            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Contact Information
              </h4>
              <div className="grid gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.email}</span>
                  {user?.emailVerified && (
                    <Badge variant="outline" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                {user?.profile?.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.profile.phone}</span>
                  </div>
                )}
                {user?.profile?.region && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{user.profile.region.label}</span>
                  </div>
                )}
              </div>
            </div>
            <Separator />
            {/* Personal Details */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Personal Details
              </h4>
              <div className="grid gap-3">
                {user?.profile?.gender && (
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <span className="font-bold">Gender: </span>
                      {user.profile.gender}
                    </span>
                  </div>
                )}
                {user?.profile?.cin && (
                  <div className="flex items-center gap-3 text-sm">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <span className="font-bold">CIN: </span>
                      {user.profile.cin}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  {user?.profile?.isPrivate ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>
                    <span className="font-bold">Profile: </span>
                    {user?.profile?.isPrivate ? "Private" : "Public"}
                  </span>
                </div>
              </div>
            </div>
            <Separator />
            {/* Account Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Account Information
              </h4>
              <div className="grid gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <span className="font-bold">Role: </span>
                    {user?.role.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {user?.createdAt && (
                    <span>
                      <span className="font-bold">Member since: </span>
                      {format(new Date(user?.createdAt), "yyyy-MM-dd")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {user?.updatedAt && (
                    <span>
                      <span className="font-bold">Last updated: </span>
                      {format(new Date(user?.updatedAt), "yyyy-MM-dd")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Documents
              </h4>
            </div>
            <div className="flex flex-col 2xl:flex-row items-center justify-between gap-6">
              {(officialDocument || user?.profile?.officialDocumentId) && (
                <DocumentCard
                  title="Official Document"
                  icon={FileText}
                  src={officialDocument}
                  isLoading={isOfficialDocPending}
                />
              )}

              {(driverLicenseDocument ||
                user?.profile?.driverLicenseDocumentId) && (
                <DocumentCard
                  title="Driver License"
                  icon={Car}
                  src={driverLicenseDocument}
                  isLoading={isDriverDocPending}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
