import { Inter } from "next/font/google";
import Application from "@/components/Application";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import '@/styles/globals.css';
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();
export default function Home({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Reborn Back Office</title>
        <meta name="description" content="Reborn Back Office" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Application
            Component={Component}
            pageProps={pageProps}
          />
        </ThemeProvider>
      </AuthProvider>
      </QueryClientProvider>
    </>
  );
}