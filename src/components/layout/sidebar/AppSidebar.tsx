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
  Home,
  Table,
  Table2,
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
import { useTranslation } from "react-i18next";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation("common");
  const data = {
    teams: [
      {
        name: "Reborn Back Office",
        logo: (
          <Image
            src="/reborn.svg"
            width={40}
            height={40}
            alt="Reborn Back Office"
          />
        ),
      },
    ],

    navMain: [
      {
        id: 0,
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },

      {
        id: 1,
        title: `${t("common.sidebar.userManagement")}`,
        icon: Users,
        items: [
          {
            title: `${t("common.sidebar.users")}`,
            url: "/user-management/users",
            icon: Users,
          },
          {
            title: `${t("common.sidebar.roles")}`,
            url: "/user-management/roles",
            icon: Package,
          },
          {
            title: `${t("common.sidebar.permissions")}`,
            url: "/user-management/permissions",
            icon: WandSparkles,
          },
        ],
      },
      {
        id: 2,
        title: `${t("common.sidebar.systemReports")}`,
        url: "/system-reports",
        icon: TabletSmartphone,
        items: [
          {
            title: `${t("common.sidebar.feedbacks")}`,
            url: "/system-reports/feedbacks",
            icon: MessageCircle,
          },
          {
            title: `${t("common.sidebar.bugs")}`,
            url: "/system-reports/bugs",
            icon: Bug,
          },
          {
            title: `${t("common.sidebar.devices")}`,
            url: "/system-reports/deviceInfos",
            icon: Tablet,
          },
        ],
      },
      {
        id: 3,
        title: `${t("common.sidebar.contentManagement")}`,
        url: "/content-management",
        icon: Paperclip,
        items: [
          {
            title: `${t("common.sidebar.resources")}`,
            url: "/content-management/resources",
            icon: FileUser,
          },
          {
            title: `${t("common.sidebar.applicationProperties")}`,
            url: "/content-management/application-properties",
            icon: FileText,
          },
          {
            title: "Reference Types",
            url: "/content-management/reference-types",
            icon: Table2,
          },
          {
            title: "Reference Parameters",
            url: "/content-management/reference-parameters",
            icon: Table,
          },
        ],
      },
      {
        id: 4,
        title: `${t("common.sidebar.auditMonitoring")}`,
        url: "/audit-monitoring",
        icon: ShieldCheck,
        items: [
          {
            title: `${t("common.sidebar.logger")}`,
            url: "/audit-monitoring/logger",
            icon: FileText,
          },
          {
            title: `${t("common.sidebar.developerLogger")}`,
            url: "/audit-monitoring/dev-logger",
            icon: TerminalSquare,
          },
        ],
      },
      {
        id: 5,
        title: `${t("common.sidebar.servicesManagement")}`,
        url: "/services-management",
        icon: ShieldCheck,
        items: [
          {
            title: `${t("common.sidebar.jobs")}`,
            url: "/services-management/jobs",
            icon: BriefcaseBusiness,
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
