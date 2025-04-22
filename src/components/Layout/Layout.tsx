import React from "react";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import {
  BreadcrumbContext,
  BreadcrumbRoute,
} from "../../context/BreadcrumbContext";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppVersion } from "./AppVersion";
import { AppSidebar } from "./Sidebar/AppSidebar";
import { Footer } from "./Footer";
import { FooterContext } from "@/context/FooterContext";
import { IntroContext } from "@/context/IntroContext";
import { Separator } from "../ui/separator";
import { BreadcrumbCommon } from "../Common/Breadcrumb";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import NotMobileSupported from "../Common/pages/NotMobileSupported";
import Page from "@/pages/auth";
import { PageHeader } from "./PageHeader";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  const [routes, setRoutes] = React.useState<BreadcrumbRoute[]>([]);
  const breadcrumbContext = {
    routes,
    setRoutes,
    clearRoutes: () => {
      setRoutes?.([]);
    },
  };

  const [content, setContent] = React.useState<React.ReactNode>(null);
  const footerContext = {
    content,
    setContent,
    clearContent: () => {
      setContent?.(null);
    },
  };

  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const introContext = {
    title,
    description,
    setIntro: (title: string, description: string) => {
      setTitle(title);
      setDescription(description);
    },
    clearIntro: () => {
      setTitle("");
      setDescription("");
    },
  };

  const isMobile = useMediaQuery("(max-width: 767px)");

  if (isMobile) {
    return (
      <div
        className={cn(
          "flex justify-center items-center overflow-hidden fullscreen"
        )}
      >
        <NotMobileSupported />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex md:flex-cols-[220px_1fr] lg:flex-cols-[280px_1fr] overflow-hidden fullscreen"
      )}
    >
      <SidebarProvider>
        <SidebarInset>
          <BreadcrumbContext.Provider value={breadcrumbContext}>
            <IntroContext.Provider value={introContext}>
              <FooterContext.Provider value={footerContext}>
                <div className="flex flex-row flex-1 overflow-hidden">
                  {/* Sidebar */}
                  <AppSidebar />
                  {/* Header , Main & Footer */}
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <Header />
                    <PageHeader className="py-5 px-10" />
                    <main
                      className={cn(
                        "flex flex-col flex-1 overflow-hidden px-10",
                        // "no-scrollbar",
                        className
                      )}
                    >
                      {children}
                    </main>
                    {content && <Footer />}
                  </div>
                </div>
              </FooterContext.Provider>
            </IntroContext.Provider>
          </BreadcrumbContext.Provider>
          <AppVersion className="fixed bottom-0 left-0 z-50 p-2 text-xs" />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
