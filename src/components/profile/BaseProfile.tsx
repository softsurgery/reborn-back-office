import React from "react";
import {
  BarChart2,
  User as UserIcon,
  Settings as SettingsIcon,
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

interface BaseProfileProps {
  className?: string;
  isFetchUserPending?: boolean;
}

export const BaseProfile = ({
  className,
  isFetchUserPending,
}: BaseProfileProps) => {
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
  const { data: followDataCount, isPending: isFollowDataCountPending } =
    useQuery({
      queryKey: ["follow-data-count", user?.id],
      queryFn: () => api.follow.findDataCount(user?.id!),
      enabled: !!user?.id,
    });

  const { data: picture } = useQuery({
    queryKey: ["picture", user?.profile?.pictureId],
    queryFn: () => api.upload.getUploadById(user?.profile?.pictureId!),
    enabled: !!user?.profile?.pictureId,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    userStore.set("followers", followers);
    userStore.set("followings", followings);
  }, [followers, followings]);

  React.useEffect(() => {
    if (user) userStore.set("picture", picture);
  }, [picture]);

  if (isFetchUserPending) {
    return <Spinner className="h-screen" />;
  }

  const tabs = [
    {
      value: "about",
      label: "About",
      icon: UserIcon,
      content: <About />,
    },
    {
      value: "activity",
      label: "Activity",
      icon: BarChart2,
      content: <Activity userId={user?.id} />,
    },
    {
      value: "settings",
      label: "Settings",
      icon: SettingsIcon,
      content: <Settings />,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col flex-1 h-full overflow-auto no-scrollbar container mx-auto",
        className
      )}
    >
      <div className="flex flex-col flex-1 overflow-auto no-scrollbar h-full">
        {/* Info */}
        <div className="flex flex-row items-center justify-between gap-4 p-4">
          {/* Profile Info Row */}
          <div className="flex flex-row items-center gap-4">
            {/* Profile Picture */}
            <Avatar className={cn("w-24 h-24", className)}>
              <AvatarImage src={picture} />
              <AvatarFallback>
                {user?.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-start">
              <div className="flex flex-col items-start">
                <h1 className="font-semibold text-lg">{identifyUser(user)}</h1>
                <h2 className="text-sm text-muted-foreground hover:underline cursor-pointer">
                  <a href={`mailto:${user?.email}`}>{user?.email}</a>
                </h2>
              </div>
              <div className="flex flex-row items-center">
                <p className="text-sm text-muted-foreground">
                  {user?.profile?.region?.label}
                </p>
                <Separator orientation="vertical" className="mx-1 h-4" />
                <p className="text-sm text-muted-foreground">
                  {user?.profile?.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-end md:justify-start md:gap-4">
            <div className="text-center">
              <div className="font-semibold text-lg">-</div>
              <div className="text-sm text-muted-foreground">Services</div>
            </div>
            <div
              className="text-center cursor-pointer"
              onClick={openFollowingDialog}
            >
              <div className="font-semibold text-lg">
                {followDataCount?.following ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
            <div
              className="text-center cursor-pointer"
              onClick={openFollowerDialog}
            >
              <div className="font-semibold text-lg">
                {followDataCount?.followers ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Tab Headers */}
          <TabsList className="grid grid-cols-3 mb-4">
            {tabs.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          <div className="flex flex-col flex-1 overflow-hidden h-full">
            {tabs.map(({ value, content }) =>
              activeTab === value ? (
                <TabsContent
                  key={value}
                  value={value}
                  className="flex flex-col flex-1 overflow-hidden h-full"
                >
                  {content}
                </TabsContent>
              ) : null
            )}
          </div>
        </Tabs>
      </div>
      {followingDialog}
      {followerDialog}
    </div>
  );
};
