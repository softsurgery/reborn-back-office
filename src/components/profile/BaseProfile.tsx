import React from "react";
import {
  BarChart2,
  User as UserIcon,
  Settings as SettingsIcon,
  BellIcon,
  BookUser,
  Mail,
  MapPin,
  Phone,
  Briefcase,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "../shared/Spinner";
import { About } from "./cards/About";
import { Activity } from "./cards/Activity";
import { Settings } from "./cards/Settings";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useServerImages } from "@/hooks/content/useServerImages";
import { useFollowerDialog } from "./modals/FollowersDialog";
import { useFollowingDialog } from "./modals/FollowingDialog";
import { useFollowSystem } from "@/hooks/useFollowSystem";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useTranslation } from "react-i18next";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Conversations } from "./cards/Conversations";
import { Notifications } from "../audit-monitoring/notifications/Notifications";
import { Book } from "./cards/Book";
import { Jobs } from "./cards/Jobs";
import { useUi } from "@/contexts/UiContext";

interface BaseProfileProps {
  className?: string;
  isFetchUserPending?: boolean;
}

export const BaseProfile = ({
  className,
  isFetchUserPending,
}: BaseProfileProps) => {
  const { t } = useTranslation("user-management");
  const userStore = useUserStore();
  const {
    setHideScrollbar,
    setScrollable,
    clearHideScrollbar,
    clearScrollable,
  } = useUi();
  const user = React.useMemo(() => userStore.response, [userStore]);
  const [activeTab, setActiveTab] = React.useState("about");

  React.useEffect(() => {
    setScrollable?.(true);
    setHideScrollbar?.(true);
    return () => {
      clearScrollable?.();
      clearHideScrollbar?.();
    };
  }, [setScrollable, clearScrollable, setHideScrollbar, clearHideScrollbar]);

  const { followerDialog, openFollowerDialog } = useFollowerDialog({
    userStore,
  });
  const { followingDialog, openFollowingDialog } = useFollowingDialog({
    userStore,
  });

  const { followers, followings } = useFollowSystem({
    id: userStore?.response?.id!,
    use: ["is-following", "followers", "followings"],
  });

  const { data: followDataCount } = useQuery({
    queryKey: ["follow-data-count", user?.id],
    queryFn: () => api.follow.findDataCount(user?.id!),
    enabled: !!user?.id,
  });

  const {
    uploads: [picture],
  } = useServerImages({
    ids: [user?.pictureId],
    enabled: !!user?.pictureId,
  });

  React.useEffect(() => {
    if (userStore.followers !== followers) {
      userStore.set("followers", followers);
    }
    if (userStore.followings !== followings) {
      userStore.set("followings", followings);
    }
  }, [followers, followings, userStore]);

  React.useEffect(() => {
    if (user && userStore.picture !== picture) {
      userStore.set("picture", picture);
    }
  }, [picture, user, userStore]);

  if (isFetchUserPending) return <Spinner className="h-screen" />;

  const tabs = [
    {
      value: "about",
      label: t("userManagement.inspect.tabs.about"),
      icon: UserIcon,
      content: <About />,
    },
    {
      value: "jobs",
      label: t("userManagement.inspect.tabs.jobs", "Jobs"),
      icon: Briefcase,
      content: <Jobs userId={user?.id} />,
    },
    {
      value: "career",
      label: t("userManagement.inspect.tabs.career"),
      icon: BookUser,
      content: <Book />,
    },
    {
      value: "activity",
      label: t("userManagement.inspect.tabs.activity"),
      icon: BarChart2,
      content: <Activity userId={user?.id} />,
    },
    {
      value: "conversations",
      label: t("userManagement.inspect.tabs.conversations"),
      icon: ChatBubbleIcon,
      content: <Conversations />,
    },
    {
      value: "notifications",
      label: t("userManagement.inspect.tabs.notifications"),
      icon: BellIcon,
      content: <Notifications userId={user?.id as string} />,
    },
    {
      value: "settings",
      label: t("userManagement.inspect.tabs.settings"),
      icon: SettingsIcon,
      content: <Settings />,
    },
  ];

  return (
    <div
      className={cn("flex flex-col flex-1 container mx-auto py-2", className)}
    >
      {/* Header Banner (Profile + Stats) */}
      <div className="relative rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden mb-6 flex-shrink-0">
        {/* Subtle decorative top strip banner */}
        <div className="h-52 bg-gradient-to-r from-primary/20 via-primary/5 to-muted/40 border-b border-border/40 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-25 dark:opacity-10" />
        </div>

        <div className="px-6 pb-6 pt-0 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 -mt-12 relative z-10">
          {/* Profile Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <Avatar className="w-28 h-28">
              <AvatarImage
                src={picture}
                alt={identifyUser(user)}
                className="object-cover rounded-full"
              />
              <AvatarFallback className="rounded-full text-2xl font-bold bg-primary/10 text-primary">
                {identifyUserAvatar(user)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-bold text-2xl tracking-tight text-foreground">
                  {identifyUser(user) ||
                    t("userManagement.inspect.unknownUser")}
                </h1>
                {user?.role?.label && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/15 text-primary border-primary/20 hover:bg-primary/20 text-xs font-semibold px-2.5 py-0.5"
                  >
                    {user.role.label}
                  </Badge>
                )}
                {typeof user?.isActive === "boolean" && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs px-2 py-0.5 font-medium border",
                      user.isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                    )}
                  >
                    {user.isActive
                      ? t("userManagement.inspect.about.active", "Active")
                      : t("userManagement.inspect.about.inactive", "Inactive")}
                  </Badge>
                )}
              </div>

              {user?.username && (
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <span>@{user.username}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs sm:text-sm text-muted-foreground">
                <a
                  href={`mailto:${user?.email}`}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-primary/70" />
                  <span>
                    {user?.email || t("userManagement.inspect.noEmail")}
                  </span>
                </a>
                <Separator
                  orientation="vertical"
                  className="h-3.5 hidden sm:block"
                />
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary/70" />
                  <span>
                    {user?.region?.label ||
                      t("userManagement.inspect.noRegion")}
                  </span>
                </div>
                {user?.phone && (
                  <>
                    <Separator
                      orientation="vertical"
                      className="h-3.5 hidden sm:block"
                    />
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-primary/70" />
                      <span>{user.phone}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-border/60">
            <div className="flex flex-col items-center justify-center bg-muted/40 hover:bg-muted/70 rounded-xl px-5 py-3 border border-border/50 transition-all text-center">
              <span className="font-bold text-xl text-foreground">-</span>
              <span className="text-xs font-medium text-muted-foreground">
                {t("userManagement.inspect.stats.services")}
              </span>
            </div>
            <div
              className="flex flex-col items-center justify-center bg-muted/40 hover:bg-muted/70 rounded-xl px-5 py-3 border border-border/50 transition-all text-center cursor-pointer shadow-2xs hover:shadow-sm hover:border-primary/30"
              onClick={openFollowingDialog}
            >
              <span className="font-bold text-xl text-foreground">
                {followDataCount?.following ?? 0}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {t("userManagement.inspect.stats.following")}
              </span>
            </div>
            <div
              className="flex flex-col items-center justify-center bg-muted/40 hover:bg-muted/70 rounded-xl px-5 py-3 border border-border/50 transition-all text-center cursor-pointer shadow-2xs hover:shadow-sm hover:border-primary/30"
              onClick={openFollowerDialog}
            >
              <span className="font-bold text-xl text-foreground">
                {followDataCount?.followers ?? 0}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {t("userManagement.inspect.stats.followers")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col flex-1">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col flex-1"
        >
          <TabsList className="grid grid-cols-7 mb-6 p-1.5 bg-muted/60 rounded-xl border border-border/50 flex-shrink-0 h-auto">
            {tabs.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center justify-center gap-2.5 py-3.5 px-3 rounded-lg font-semibold text-base transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm cursor-pointer"
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="hidden lg:block truncate">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          <div className="flex flex-col flex-1">
            {tabs.map(({ value, content }) =>
              activeTab === value ? (
                <TabsContent
                  key={value}
                  value={value}
                  className="flex flex-col flex-1"
                >
                  {content}
                </TabsContent>
              ) : null,
            )}
          </div>
        </Tabs>
      </div>

      {followingDialog}
      {followerDialog}
    </div>
  );
};
