import React from "react";
import Image from "next/image";
import logo from "/public/next.svg";
import { AuthenticationForm } from "./AuthenticationForm";
import { Box } from "lucide-react";
import { ForgotPasswordForm } from "./ForgetPasswordForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { useSearchParams } from "next/navigation";
import { clearQueryParams, setQueryParams } from "@/lib/url.lib";
import { useRouter } from "next/router";

type Screen = "login" | "forgot-password" | "reset-password";

export const AuthenticationLayout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const screenParam = searchParams.get("target") as Screen | null;
  const tokenParam = searchParams.get("token") as string | null;

  const [target, setTarget] = React.useState<Screen>("login");

  React.useEffect(() => {
    if (screenParam === "forgot-password" || screenParam === "reset-password") {
      setTarget(screenParam);
    }
    if (!tokenParam && screenParam === "reset-password") {
      setTarget("login");
      clearQueryParams(router);
    }
  }, [screenParam, tokenParam]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2 no-select">
      <div className="flex flex-col gap-4 p-6 md:p-10 overflow-auto">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Box size={24} />
            </div>
            Reborn Back Office
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full">
            <div className="bg-background flex flex-col items-center gap-4 justify-center h-full my-4">
              {target === "login" && (
                <AuthenticationForm
                />
              )}
              {target === "forgot-password" && (
                <ForgotPasswordForm
                  goToAuthentication={() => {
                    setTarget("login");
                    clearQueryParams(router);
                  }}
                />
              )}
              {target === "reset-password" && (
                <ResetPasswordForm
                  goToAuthentication={() => {
                    setTarget("login");
                    clearQueryParams(router);
                  }}
                  token={tokenParam}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src={logo}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover grayscale"
          draggable="false"
        />
      </div>
    </div>
  );
};
