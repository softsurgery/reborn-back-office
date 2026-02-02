import React from "react";
import {
  BarChart2,
  User as UserIcon,
  Settings as SettingsIcon,
  BellIcon,
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
import { useFollowerDialog } from "./modals/FollowersDialog";
import { useFollowingDialog } from "./modals/FollowingDialog";
import { useFollowSystem } from "@/hooks/useFollowSystem";
import { identifyUser } from "@/lib/user.utils";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Conversations } from "./cards/Conversations";
import { Notifications } from "../audit-monitoring/notifications/Notifications";

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
  const user = React.useMemo(() => userStore.response, [userStore]);
  const [activeTab, setActiveTab] = React.useState("about");

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

  const { data: picture } = useQuery({
    queryKey: ["picture", user?.pictureId],
    queryFn: () => api.upload.getUploadById(user?.pictureId!),
    enabled: !!user?.pictureId,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    userStore.set("followers", followers);
    userStore.set("followings", followings);
  }, [followers, followings]);

  React.useEffect(() => {
    if (user) userStore.set("picture", picture);
  }, [picture]);

  if (isFetchUserPending) return <Spinner className="h-screen" />;

  const tabs = [
    {
      value: "about",
      label: t("userManagement.inspect.tabs.about"),
      icon: UserIcon,
      content: <About />,
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
    <div className={cn("flex flex-col h-full container mx-auto", className)}>
      {/* Header (Profile + Stats) */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 flex-shrink-0">
        {/* Profile Info */}
        <div className="flex flex-row items-center gap-4">
          <Avatar className="w-24 h-24 rounded-full">
            <AvatarImage src={picture} />
            <AvatarFallback>{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-start">
            <h1 className="font-semibold text-lg">
              {identifyUser(user) || "Unknown User"}
            </h1>
            <h2 className="text-sm text-muted-foreground hover:underline cursor-pointer">
              <a href={`mailto:${user?.email}`}>{user?.email || "No email"}</a>
            </h2>
            <div className="flex flex-row items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {user?.region?.label || t("userManagement.inspect.noRegion")}
              </p>
              <Separator orientation="vertical" className="mx-1 h-4" />
              <p className="text-sm text-muted-foreground">
                {user?.phone || t("userManagement.inspect.noPhoneNumber")}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-end md:justify-start gap-4">
          <div className="text-center">
            <div className="font-semibold text-lg">-</div>
            <div className="text-sm text-muted-foreground">
              {t("userManagement.inspect.stats.services")}
            </div>
          </div>
          <div
            className="text-center cursor-pointer"
            onClick={openFollowingDialog}
          >
            <div className="font-semibold text-lg">
              {followDataCount?.following ?? 0}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("userManagement.inspect.stats.following")}
            </div>
          </div>
          <div
            className="text-center cursor-pointer"
            onClick={openFollowerDialog}
          >
            <div className="font-semibold text-lg">
              {followDataCount?.followers ?? 0}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("userManagement.inspect.stats.followers")}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col h-full"
        >
          <TabsList className="grid grid-cols-5 mb-4 flex-shrink-0">
            {tabs.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:block">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {tabs.map(({ value, content }) =>
              activeTab === value ? (
                <TabsContent
                  key={value}
                  value={value}
                  className="flex flex-col h-full"
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
