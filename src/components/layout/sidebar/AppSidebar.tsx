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
  ShieldCheck,
  FileText,
  TerminalSquare,
  Tag,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { MainNav } from "./MainNav";
import { TeamSwitcher } from "./TeamSwitcher";
import { id } from "date-fns/locale";

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
            url: "/content-management/resources",
            icon: FileUser,
          },
          {
            title: "Regions",
            url: "/content-management/regions",
            icon: MapIcon,
          },
          {
            title: "Application Properties",
            url: "/content-management/application-properties",
            icon: FileText,
          },
        ],
      },
      {
        id: 4,
        title: "Audit & Monitoring",
        url: "/audit-monitoring",
        icon: ShieldCheck,
        items: [
          {
            title: "Logger",
            url: "/audit-monitoring/logger",
            icon: FileText,
          },
          {
            title: "Developer Logger",
            url: "/audit-monitoring/dev-logger",
            icon: TerminalSquare,
          },
        ],
      },
      {
        id: 5,
        title: "Services Management",
        url: "/services-management",
        icon: ShieldCheck,
        items: [
          {
            title: "Jobs",
            url: "/services-management/jobs",
            icon: BriefcaseBusiness,
          },
          {
            title: "Job Tags",
            url: "/services-management/job-tags",
            icon: Tag,
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

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    e.stopPropagation();
    if (!open) {
      toggleSidebar();
      hoverToggledRef.current = true;
    }
  };

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
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
