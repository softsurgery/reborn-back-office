import * as React from "react";
import {
  BriefcaseBusiness,
  Frame,
  Map,
  MessageCircle,
  PieChart,
  Tablet,
  TabletSmartphone,
  Users,
  Bug,
  Package,
  WandSparkles,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { MainNav } from "./MainNav";
import { UserNav } from "./UserNav";
import { TeamSwitcher } from "./TeamSwitcher";

const data = {
  teams: [
    {
      name: "Reborn",
      logo: BriefcaseBusiness,
    },
  ],
  navMain: [
    {
      id: 1,
      title: "User Management",
      icon: Users,
      items: [
        {
          title: "Users",
          url: "/user-management/users",
          icon: Users,
        },
        {
          title: "Roles",
          url: "/user-management/roles",
          icon: Package,
        },
        {
          title: "Permissions",
          url: "/user-management/permissions",
          icon: WandSparkles,
        },
      ],
    },
    {
      id: 2,
      title: "System Reports",
      url: "/system-reports",
      icon: TabletSmartphone,
      items: [
        {
          title: "Feedbacks",
          url: "/system-reports/feedbacks",
          icon: MessageCircle,
        },
        {
          title: "Bugs",
          url: "/system-reports/bugs",
          icon: Bug,
        },
        {
          title: "DeviceInfo",
          url: "/system-repoorts/deviceInfos",
          icon: Tablet,
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* @ts-ignore */}
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* @ts-ignore */}
        <MainNav items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
