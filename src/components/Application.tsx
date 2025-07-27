import React from "react";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Spinner } from "./shared/Spinner";
import { Layout } from "./Layout/Layout";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

interface ApplicationProps {
  className?: string;
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
}

const publicRoutes = ["/auth"];
const protectedHome = "/";

function Application({ className, Component, pageProps }: ApplicationProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [hasMounted, setHasMounted] = React.useState(false);

  const isAuthPage = publicRoutes.some((route) =>
    router.pathname.startsWith(route)
  );
  const isProtectedRoute = !isAuthPage;

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  React.useEffect(() => {
    if (status === "loading") return;

    if (isAuthPage && session) {
      router.replace(protectedHome);
    }

    if (isProtectedRoute && !session) {
      router.replace("/auth");
    }
  }, [status, session, isAuthPage, isProtectedRoute, router]);

  const shouldBlockRender =
    !hasMounted ||
    status === "loading" ||
    (isAuthPage && session) ||
    (isProtectedRoute && !session);

  if (shouldBlockRender) {
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
      {isAuthPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout className="flex w-full">
          <Component {...pageProps} />
        </Layout>
      )}
      <Toaster className="m-5" />
    </div>
  );
}

export default Application;
