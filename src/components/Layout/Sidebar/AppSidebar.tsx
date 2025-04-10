import * as React from "react";
import {
  BookOpen,
  Briefcase,
  BriefcaseBusiness,
  ChartLine,
  ChartNoAxesColumnIncreasing,
  CheckCheck,
  CircleHelp,
  ClipboardCheck,
  Cpu,
  Database,
  FileSearch,
  Flag,
  Frame,
  Globe,
  Info,
  Landmark,
  LayoutDashboard,
  Logs,
  LogsIcon,
  Map,
  MessageCircle,
  Monitor,
  OctagonX,
  PieChart,
  Settings2,
  Tablet,
  Shield,
  TabletSmartphone,
  Users,
  Bug,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { MainNav } from "./MainNav";
import { UserNav } from "./UserNav";
import { TeamSwitcher } from "./TeamSwitcher";
import { NavProjects } from "./ProjectNav";

const data = {
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  teams: [
    {
      name: "Reborn",
      logo: BriefcaseBusiness,
    },
  ],
  navMain: [
    // {
    //   id: 1,
    //   title: "Général",
    //   url: "#",
    //   icon: LayoutDashboard,
    //   isActive: true,
    //   items: [
    //     {
    //       title: "Tableau de bord",
    //       url: "#",
    //       icon: ChartLine,
    //     },
    //     {
    //       title: "Tous les Textes",
    //       url: "#",
    //       icon: Database,
    //     },
    //     {
    //       title: "Mes Textes",
    //       url: "#",
    //       icon: Logs,
    //     },
    //   ],
    // },
    // {
    //   id: 2,
    //   title: "Analyse",
    //   url: "#",
    //   icon: ChartNoAxesColumnIncreasing,
    //   items: [
    //     {
    //       title: "Non Analysé",
    //       url: "#",
    //       icon: CircleHelp,
    //     },
    //     {
    //       title: "Non Conformes",
    //       url: "#",
    //       icon: OctagonX,
    //     },
    //     {
    //       title: "Partiel Conformes",
    //       url: "#",
    //       icon: FileSearch,
    //     },
    //     {
    //       title: "Candidats Conformes",
    //       url: "#",
    //       icon: Flag,
    //     },
    //     {
    //       title: "Conformes",
    //       url: "#",
    //       icon: CheckCheck,
    //     },
    //   ],
    // },
    // {
    //   id: 3,
    //   title: "Etat Des Actions",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Bilan des Actions",
    //       url: "#",
    //       icon: ClipboardCheck,
    //     },
    //     {
    //       title: "Toutes les Actions",
    //       url: "#",
    //       icon: Logs,
    //     },
    //   ],
    // },
    // {
    //   id: 4,
    //   title: "Applicabilté",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "Applicables",
    //       url: "#",
    //       icon: ClipboardCheck,
    //     },
    //     {
    //       title: "A Vérifier",
    //       url: "#",
    //       icon: CircleHelp,
    //     },
    //     {
    //       title: "Pour Info",
    //       url: "#",
    //       icon: Info,
    //     },
    //   ],
    // },
    {
      id: 5,
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
          url: "/system-repoorts/bugs",
          icon: Bug,
        },
        {
          title: "DeviceInfo",
          url: "/system-repoorts/deviceInfos",
          icon: Tablet,
        },
      ],
    },
    {
      id: 6,
      title: "Administrative Tools",
      url: "#",
      icon: Shield,
      items: [
        // {
        //   title: "Application Metadata",
        //   url: "/app-metadata/landing",
        //   icon: Database,
        // },
        // {
        //   title: "Application Services",
        //   url: "/app-services/mailing",
        //   icon: Cpu,
        // },
        {
          title: "User Management",
          url: "/user-management/users",
          icon: Users,
        },
        // {
        //   title: "Logger",
        //   url: "#",
        //   icon: LogsIcon,
        // },
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
        <MainNav items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>{/* <UserNav user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
