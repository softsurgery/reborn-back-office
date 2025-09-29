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

interface AboutProps {
  className?: string;
}

export const About = ({ className }: AboutProps) => {
  const [showDocuments, setShowDocuments] = React.useState(true);
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDocuments(!showDocuments)}
                className="flex items-center gap-2"
              >
                {showDocuments ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {showDocuments ? "Hide" : "Show"}
              </Button>
            </div>

            {showDocuments && (
              <div className="space-y-4">
                {/* Official Document */}
                {(officialDocument || user?.profile?.officialDocumentId) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Official Document
                    </div>
                    <div className="relative w-full overflow-hidden rounded-lg border bg-muted">
                      {isOfficialDocPending ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <Image
                          src={
                            officialDocument ||
                            "/placeholder.svg?height=300&width=400&query=official document placeholder"
                          }
                          alt="Official Document"
                          width={200}
                          height={300}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Driver License Document */}
                {(driverLicenseDocument ||
                  user?.profile?.driverLicenseDocumentId) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      Driver License
                    </div>
                    <div className="relative w-full overflow-hidden rounded-lg border bg-muted">
                      {isDriverDocPending ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <Image
                          src={
                            driverLicenseDocument ||
                            "/placeholder.svg?height=300&width=400&query=driver license placeholder"
                          }
                          alt="Driver License"
                          width={200}
                          height={300}
                        />
                      )}
                    </div>
                  </div>
                )}

                {!officialDocument &&
                  !driverLicenseDocument &&
                  !user?.profile?.officialDocumentId &&
                  !user?.profile?.driverLicenseDocumentId && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No documents uploaded</p>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
