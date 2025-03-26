import { Shield, Settings, FileStackIcon, MessageSquareShare } from "lucide-react";

export interface MenuItem {
  id: number;
  title: string;
  href: string;
  icon: React.ReactNode;
}

export const items: MenuItem[] = [
  {
    id: 1,
    title: "Users Management",
    href: "/users-management/permissions",
    icon: <Shield />,
  },
  {
    id: 2,
    title: "File Management",
    href: "/file-management",
    icon: <FileStackIcon />,
  },
  {
    id: 3,
    title: "Feedback Management",
    href: "/feedback-management/feedbacks",
    icon: <MessageSquareShare />,
  },
  {
    id: 4,
    title: "Settings",
    href: "/settings",
    icon: <Settings />,
  },
];
