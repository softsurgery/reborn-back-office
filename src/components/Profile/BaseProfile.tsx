import React from "react";
import { useCurrentUser } from "@/hooks/content/User/useCurrentUser";
import {
  BarChart2,
  User as UserIcon,
  Settings as SettingsIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCard } from "./UserCard";
import { Spinner } from "../Common/Spinner";
import { About } from "./cards/About";
import { Activity } from "./cards/Activity";
import { Settings } from "./cards/Settings";
import { User } from "@/prisma/interfaces";
import { cn } from "@/lib/utils";

interface BaseProfileProps {
  className?: string;
  user?: User | null;
  isFetchUserPending?: boolean;
}

export const BaseProfile = ({
  className,
  user,
  isFetchUserPending,
}: BaseProfileProps) => {
  if (!user || isFetchUserPending) {
    return <Spinner className="h-screen" />;
  }
  return (
    <div
      className={cn(
        "flex flex-col flex-1 overflow-hidden no-scrollbar container mx-auto",
        className
      )}
    >
      <div className="flex flex-col flex-1 overflow-hidden gap-5 h-full">
        {/* Profile Sidebar */}
        <UserCard user={user} className="h-fit" />

        {/* Main Content */}
        <Tabs defaultValue="about" className="flex flex-col flex-1 overflow-hidden">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="about" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>About</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Activity</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-col flex-1 overflow-auto py-4 no-scrollbar">
            <TabsContent value="about">
              <About />
            </TabsContent>

            <TabsContent value="activity">
              <Activity />
            </TabsContent>

            <TabsContent value="settings">
              <Settings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
