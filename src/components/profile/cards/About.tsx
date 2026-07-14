import React from "react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar,
  CreditCard,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  AtSign,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Cake,
  Sparkles,
} from "lucide-react";
import { useUpload } from "@/hooks/content/useUpload";
import { DocumentCard } from "./DocumentCard";
import { ResponseUserUploadDto } from "@/types";

interface AboutProps {
  className?: string;
}

const UserDocumentItem = ({ item }: { item: ResponseUserUploadDto }) => {
  const { upload, isUploadPending } = useUpload({ id: item.uploadId });
  const title = item.upload?.filename || `Document #${item.uploadId}`;
  return (
    <DocumentCard
      title={title}
      src={upload}
      isLoading={isUploadPending}
      className="w-full max-w-none border border-border/60 shadow-2xs hover:shadow-sm transition-all"
    />
  );
};

export const About = ({ className }: AboutProps) => {
  const { t } = useTranslation("user-management");
  const userStore = useUserStore();
  const user = userStore.response;

  const calculateAge = (dob: Date | string) => {
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const dobFormatted =
    user?.dateOfBirth && !isNaN(new Date(user.dateOfBirth).getTime())
      ? format(new Date(user.dateOfBirth), "yyyy-MM-dd")
      : null;
  const age = user?.dateOfBirth ? calculateAge(user.dateOfBirth) : null;

  return (
    <Card
      className={cn(
        className,
        "flex flex-col flex-1 overflow-auto mb-5 h-fit border shadow-sm",
      )}
      style={{ maxHeight: window.screen.height - 100 }}
    >
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t("userManagement.inspect.about.title")}
            </CardTitle>
            <CardDescription className="mt-1.5">
              {user?.bio
                ? user.bio
                : t("userManagement.inspect.about.bio", "No bio available")}
            </CardDescription>
          </div>
          {typeof user?.isActive === "boolean" && (
            <Badge
              variant="outline"
              className={cn(
                "w-fit flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium border shadow-2xs",
                user.isActive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
              )}
            >
              {user.isActive ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t("userManagement.inspect.about.active", "Active Account")}
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  {t(
                    "userManagement.inspect.about.inactive",
                    "Inactive Account",
                  )}
                </>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Contact, Personal Details & Account Info */}
          <div className="space-y-6 lg:w-1/2">
            {/* Contact Information */}
            <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/50">
              <h4 className="font-semibold text-xs text-primary uppercase tracking-wider flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                {t("userManagement.inspect.about.contact")}
              </h4>
              <div className="grid gap-3 pt-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground/70" />
                    {t("userManagement.columns.email", "Email")}
                  </span>
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <span>
                      {user?.email || t("userManagement.inspect.noEmail")}
                    </span>
                    {user?.emailVerified && (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] px-1.5 py-0 font-semibold"
                      >
                        {t("userManagement.inspect.about.emailVerified")}
                      </Badge>
                    )}
                  </div>
                </div>

                {user?.phone && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground/70" />
                      {t("userManagement.columns.phone", "Phone")}
                    </span>
                    <span className="font-medium text-foreground">
                      {user.phone}
                    </span>
                  </div>
                )}

                {user?.region && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground/70" />
                      {t("userManagement.forms.region", "Region")}
                    </span>
                    <span className="font-medium text-foreground">
                      {user.region.label}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/50">
              <h4 className="font-semibold text-xs text-primary uppercase tracking-wider flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                {t("userManagement.inspect.about.personal")}
              </h4>
              <div className="grid gap-3 pt-1">
                {user?.username && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <AtSign className="h-4 w-4 text-muted-foreground/70" />
                      {t("userManagement.inspect.about.username", "Username")}
                    </span>
                    <span className="font-medium text-foreground">
                      @{user.username}
                    </span>
                  </div>
                )}

                {user?.firstName && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground/70" />
                      {t(
                        "userManagement.inspect.about.firstName",
                        "First Name",
                      )}
                    </span>
                    <span className="font-medium text-foreground">
                      {user.firstName}
                    </span>
                  </div>
                )}

                {user?.lastName && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground/70" />
                      {t("userManagement.inspect.about.lastName", "Last Name")}
                    </span>
                    <span className="font-medium text-foreground">
                      {user.lastName}
                    </span>
                  </div>
                )}

                {dobFormatted && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Cake className="h-4 w-4 text-muted-foreground/70" />
                      {t(
                        "userManagement.inspect.about.dateOfBirth",
                        "Date of Birth",
                      )}
                    </span>
                    <span className="font-medium text-foreground">
                      {dobFormatted}{" "}
                      {age !== null && (
                        <span className="text-xs text-muted-foreground ml-1">
                          ({age} {t("userManagement.inspect.about.age", "yrs")})
                        </span>
                      )}
                    </span>
                  </div>
                )}

                {user?.gender && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground/70" />
                      {t("userManagement.inspect.about.gender")}
                    </span>
                    <span className="font-medium text-foreground">
                      {user.gender === "Female"
                        ? t("userManagement.inspect.about.female")
                        : user.gender === "Male"
                          ? t("userManagement.inspect.about.male", "Male")
                          : user.gender}
                    </span>
                  </div>
                )}

                {user?.cin && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground/70" />
                      {t("userManagement.inspect.about.cin", "CIN")}
                    </span>
                    <span className="font-medium text-foreground tracking-wide">
                      {user.cin}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    {user?.isPrivate ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground/70" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground/70" />
                    )}
                    {t("userManagement.inspect.about.profile")}
                  </span>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {user?.isPrivate
                      ? t("userManagement.inspect.about.private")
                      : t("userManagement.inspect.about.public")}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/50">
              <h4 className="font-semibold text-xs text-primary uppercase tracking-wider flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" />
                {t("userManagement.inspect.about.account")}
              </h4>
              <div className="grid gap-3 pt-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground/70" />
                    {t("userManagement.inspect.about.role")}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="default"
                      className="bg-primary/15 text-primary hover:bg-primary/20 border-primary/20 text-xs font-semibold"
                    >
                      {user?.role?.label || "User"}
                    </Badge>
                  </div>
                </div>

                {user?.role?.description && (
                  <div className="text-xs text-muted-foreground bg-background/60 p-2 rounded-lg border border-border/40">
                    <span className="font-medium text-foreground block mb-0.5">
                      {t(
                        "userManagement.inspect.about.roleDescription",
                        "Role Description",
                      )}
                      :
                    </span>
                    {user.role.description}
                  </div>
                )}

                {typeof user?.isApproved === "boolean" && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      {user.isApproved ? (
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <ShieldAlert className="h-4 w-4 text-amber-500" />
                      )}
                      {t("userManagement.columns.isApproved", "Approved")}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-medium border",
                        user.isApproved
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                      )}
                    >
                      {user.isApproved
                        ? t("userManagement.inspect.about.approved", "Approved")
                        : t(
                            "userManagement.inspect.about.pendingApproval",
                            "Pending Approval",
                          )}
                    </Badge>
                  </div>
                )}

                {user?.createdAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground/70" />
                      {t("userManagement.inspect.about.memberSince")}
                    </span>
                    <span className="font-medium text-foreground">
                      {format(new Date(user.createdAt), "yyyy-MM-dd")}
                    </span>
                  </div>
                )}

                {user?.updatedAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground/70" />
                      {t("userManagement.inspect.about.lastUpdated")}
                    </span>
                    <span className="font-medium text-foreground">
                      {format(new Date(user.updatedAt), "yyyy-MM-dd")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Documents */}
          <div className="lg:w-1/2 space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-border/40">
              <h4 className="font-semibold text-xs text-primary uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" />
                {t("userManagement.inspect.about.documents")}
              </h4>
              {user?.uploads && user.uploads.length > 0 && (
                <Badge variant="secondary" className="text-[11px] px-2 py-0">
                  {user.uploads.length}{" "}
                  {user.uploads.length === 1 ? "document" : "documents"}
                </Badge>
              )}
            </div>

            <div className="space-y-4 pt-1">
              {user?.uploads && user.uploads.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {[...user.uploads]
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((item) => (
                      <UserDocumentItem key={item.id} item={item} />
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-dashed border-border rounded-xl text-center space-y-3">
                  <div className="p-3 bg-muted rounded-full">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-sm text-foreground">
                    {t(
                      "userManagement.inspect.about.noDocuments",
                      "No documents uploaded yet",
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    {t(
                      "userManagement.inspect.about.noDocumentsDesc",
                      "Official identity or certification documents attached to this profile will appear here.",
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
