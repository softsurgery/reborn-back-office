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
import { cn } from "@/lib/utils";
import { useUserStore } from "@/hooks/stores/useUserStore";

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
  const [activeTab, setActiveTab] = useState("about");

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
      content: <Activity />,
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
