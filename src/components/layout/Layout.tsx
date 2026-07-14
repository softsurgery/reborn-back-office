import React from "react";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import {
  BreadcrumbContext,
  BreadcrumbRoute,
} from "../../contexts/BreadcrumbContext";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppVersion } from "./AppVersion";
import { AppSidebar } from "./sidebar/AppSidebar";
import { Footer } from "./Footer";
import { FooterContext } from "@/contexts/FooterContext";
import { IntroContext } from "@/contexts/IntroContext";
import { UiContext } from "@/contexts/UiContext";
import { PageHeader } from "./PageHeader";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  const [floating, setFloating] = React.useState<React.ReactNode>(null);
  const introContext = {
    title,
    description,
    floating,
    setIntro: (title: string, description?: string) => {
      setTitle(title);
      setDescription(description || "");
    },
    setFloating,
    clearIntro: () => {
      setTitle("");
      setDescription("");
    },
    clearFloating: () => {
      setFloating(null);
    },
  };

  const [scrollable, setScrollable] = React.useState<boolean>(false);
  const [hideScrollbar, setHideScrollbar] = React.useState<boolean>(false);
  const [paddingX, setPaddingX] = React.useState<string>("");

  const uiContext = {
    scrollable,
    hideScrollbar,
    paddingX,
    setScrollable,
    clearScrollable: () => {
      setScrollable?.(false);
    },
    setHideScrollbar,
    clearHideScrollbar: () => {
      setHideScrollbar?.(false);
    },
    setPaddingX,
    clearPaddingX: () => {
      setPaddingX?.("");
    },
    clearUi: () => {
      setScrollable?.(false);
      setHideScrollbar?.(false);
      setPaddingX?.("");
    },
  };

  const isMobile = useMediaQuery("(max-width: 425px)");
  return (
    <div
      className={cn(
        "flex md:flex-cols-[220px_1fr] lg:flex-cols-[280px_1fr] overflow-hidden fullscreen",
      )}
    >
      <SidebarProvider>
        <SidebarInset>
          <UiContext.Provider value={uiContext}>
            <BreadcrumbContext.Provider value={breadcrumbContext}>
              <IntroContext.Provider value={introContext}>
                <FooterContext.Provider value={footerContext}>
                  <div className="flex flex-row flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <AppSidebar />
                    {/* Header , Main & Footer */}
                    <div className="flex flex-col flex-1 overflow-hidden bg-background">
                      <Header />
                      {(title || description) && (
                        <PageHeader
                          className={cn("py-5", paddingX || (isMobile ? "px-4" : "px-10"))}
                        />
                      )}
                      <main
                        className={cn(
                          "flex flex-col flex-1",
                          scrollable
                            ? "overflow-y-auto overflow-x-hidden"
                            : "overflow-hidden",
                          hideScrollbar && "no-scrollbar",
                          paddingX || (isMobile ? "px-4" : "px-10"),
                          className,
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
          </UiContext.Provider>
          <AppVersion className="fixed bottom-0 left-0 z-50 p-2 text-xs" />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
