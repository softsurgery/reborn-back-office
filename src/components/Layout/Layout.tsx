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

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  const [routes, setRoutes] = React.useState<BreadcrumbRoute[]>([]);
  const breadcrumbContext = {
    routes,
    setRoutes,
  };

  const [content, setContent] = React.useState<React.ReactNode>(null);
  const footerContext = {
    content,
    setContent,
  };

  return (
    <div
      className={cn(
        "flex md:flex-cols-[220px_1fr] lg:flex-cols-[280px_1fr] overflow-hidden fullscreen"
      )}
    >
      <SidebarProvider>
        <SidebarInset>
          <FooterContext.Provider value={footerContext}>
            <BreadcrumbContext.Provider value={breadcrumbContext}>
              <div className="flex flex-row flex-1 overflow-hidden">
                {/* Sidebar */}
                <AppSidebar />
                {/* Header , Main & Footer */}
                <div className="flex flex-col flex-1 overflow-hidden">
                  <Header />
                  <main
                    className={cn(
                      "flex flex-col flex-1 py-4 overflow-auto no-scrollbar",
                      className
                    )}
                  >
                    <div>{children}</div>
                  </main>
                  {content && <Footer />}
                </div>
              </div>
            </BreadcrumbContext.Provider>
          </FooterContext.Provider>
          <AppVersion className="fixed bottom-0 right-0 z-50 p-2 text-xs" />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
