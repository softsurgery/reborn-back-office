import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Application from "@/components/Application";

import { ThemeProvider } from "@/context/ThemeContext";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Reborn Back Office</title>
        <meta name="description" content="Reborn Back Office" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
    </>
  );
}