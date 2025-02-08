import React from "react";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { Spinner } from "./Common/Spinner";
import { Layout } from "./Layout/Layout";
import { cn } from "@/lib/utils";
import { Toaster } from "./ui/sonner";

interface ApplicationProps {
  className?: string;
  Component: React.ComponentType<AppProps>;
  pageProps: AppProps;
}

function Application({ className, Component, pageProps }: ApplicationProps) {
  const router = useRouter();

  if (router.pathname.includes("admin")) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Spinner />
      </main>
    );
  }

  return (
    <div
      className={cn(
        `flex flex-col flex-1 overflow-hidden min-h-screen max-h-screen`,
        className
      )}
    >
      {router.pathname.includes("auth") ? (
        <Component {...pageProps} />
      ) : (
        <Layout className="flex w-full">
          <Component {...pageProps} />
        </Layout>
      )}
      <Toaster />
    </div>
  );
}

export default Application;
