import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Application from "@/components/Application";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { appWithTranslation } from "next-i18next";
import nextI18nextConfig from "../../next-i18next.config";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import { AuthTokenSync } from "@/components/auth/AuthTokenSync";

const inter = { className: "font-inter" };
const queryClient = new QueryClient();

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <>
      <Head>
        <title>Reborn Back Office</title>
        <meta name="description" content="Reborn Back Office" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <AuthTokenSync />
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Application
              Component={Component}
              pageProps={pageProps}
              className={inter.className}
            />
          </ThemeProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
};

export default appWithTranslation(App, nextI18nextConfig);
