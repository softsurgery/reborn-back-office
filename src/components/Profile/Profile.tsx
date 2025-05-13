import React from "react";
import { useCurrentUser } from "@/hooks/content/useCurrentUser";
import { BarChart2, User, Settings as SettingsIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCard } from "./UserCard";
import { Spinner } from "../Common/Spinner";
import { About } from "./About";
import { Activity } from "./Activity";
import { Settings } from "./Settings";

export const Profile = () => {
  const { user, isFetchUserPending } = useCurrentUser("role");

  if (!user || isFetchUserPending) {
    return <Spinner className="h-screen" />;
  }
  return (
    <div className="flex flex-col flex-1 overflow-auto container mx-auto my-5">
      <div className="flex flex-col  gap-5 h-full">
        {/* Profile Sidebar */}
        <UserCard user={user} className="h-fit" />

        {/* Main Content */}
        <Tabs defaultValue="about">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="about" className="flex items-center gap-2">
              <User className="h-4 w-4" />
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

          <TabsContent value="about">
            <About />
          </TabsContent>

          <TabsContent value="activity">
            <Activity />
          </TabsContent>

          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
