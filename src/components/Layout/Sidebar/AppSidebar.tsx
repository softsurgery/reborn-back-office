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
  Paperclip,
  MapIcon,
  FileUser,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { MainNav } from "./MainNav";
import { TeamSwitcher } from "./TeamSwitcher";
import { useSession } from "next-auth/react";
import { useEmailUser } from "@/hooks/content/User/useEmailUser";
import {
  identifyUser,
  identifyUserAvatar,
} from "@/lib/users-management/utils/identify-user.util";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  const data = {
    teams: [
      {
        name: "Reborn Back Office",
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
            title: "Mobile Users",
            url: "/user-management/mobile-users",
            icon: FileUser,
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
            title: "Devices",
            url: "/system-reports/deviceInfos",
            icon: Tablet,
          },
        ],
      },
      {
        id: 3,
        title: "Content Management",
        url: "/content-management",
        icon: Paperclip,
        items: [
          {
            title: "Resources",
            url: "/content/resources",
            icon: FileUser,
          },
          {
            title: "Regions",
            url: "/content/regions",
            icon: MapIcon,
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
  const { open, toggleSidebar } = useSidebar();

  const hoverToggledRef = React.useRef(false);

  const handleMouseEnter = (e : React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    if (!open) {
      toggleSidebar();
      hoverToggledRef.current = true;
    }
  };

  const handleMouseLeave = (e : React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    if (hoverToggledRef.current) {
      toggleSidebar();
      hoverToggledRef.current = false;
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarHeader>
        {/* @ts-ignore */}
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* @ts-ignore */}
        <MainNav items={data.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
