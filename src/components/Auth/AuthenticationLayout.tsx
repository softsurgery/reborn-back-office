import Image from "next/image";
import logo from "/public/next.svg";
import { AuthenticationForm } from "./AuthenticationForm";
import { Box } from "lucide-react";
import React from "react";
import { ForgotPasswordForm } from "./ForgetPasswordForm";

type Screen = "login" | "forgot-password" | "reset-password";

export const AuthenticationLayout = () => {
  const [screen, setSecreen] = React.useState<Screen>("login");
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
              {screen === "login" && <AuthenticationForm goToForgotPassword={() => setSecreen("forgot-password")} />}
              {screen === "forgot-password" && <ForgotPasswordForm goToAuthentication={() => setSecreen("login")} />}
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
