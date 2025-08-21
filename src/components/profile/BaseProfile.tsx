import React, { useState } from "react";
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
import { ResponseUserDto } from "@/types";
import { cn } from "@/lib/utils";

interface BaseProfileProps {
  className?: string;
  user?: ResponseUserDto | null;
  isFetchUserPending?: boolean;
}

export const BaseProfile = ({
  className,
  user,
  isFetchUserPending,
}: BaseProfileProps) => {
  const [activeTab, setActiveTab] = useState("about");

  if (!user || isFetchUserPending) {
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
      content: <Activity userId={user.id} />,
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
        "flex flex-col flex-1 h-full overflow-hidden no-scrollbar container mx-auto",
        className
      )}
    >
      <div className="flex flex-col flex-1 overflow-hidden gap-5 h-full">
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
    </div>
  );
};
