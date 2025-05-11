import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GithubButton } from "./GithubButton";
import { GoogleButton } from "./GoogleButton";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { PasswordField } from "../Common/PasswordField";

interface AuthenticationFormProps {
  className?: string;
  goToForgotPassword: () => void;
}

export function AuthenticationForm({
  className,
  goToForgotPassword,
}: AuthenticationFormProps) {
  const [usernameOrEmail, setUsernameOrEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  const { mutate: signInMutator, isPending: isSignInPending } = useMutation({
    mutationFn: async (data: {
      method: "credentials" | "github" | "google";
      usernameOrEmail?: string;
      password?: string;
    }) => {
      const result = await signIn(data.method, {
        redirect: false,
        callbackUrl: "/",
        ...(data.method === "credentials" && {
          usernameOrEmail: data.usernameOrEmail,
          password: data.password,
        }),
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      router.push("/");
      toast.success("Welcome back!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSignIn = () => {
    signInMutator({ method: "credentials", usernameOrEmail, password });
  };
  return (
    <div className={cn("flex flex-col gap-6 w-[350px]", className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email/Username</Label>
          <Input
            id="email"
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            disabled={isSignInPending}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              onClick={goToForgotPassword}
              className="ml-auto text-sm underline-offset-4 hover:underline cursor-pointer"
            >
              Forgot your password?
            </a>
          </div>
          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSignInPending}
          />
        </div>

        <Button
          type="button"
          className="w-full"
          onClick={handleSignIn}
          disabled={isSignInPending}
        >
          Login
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <GithubButton
          onClick={() => signInMutator({ method: "github" })}
          disabled={isSignInPending}
        />
        <GoogleButton
          onClick={() => signInMutator({ method: "google" })}
          disabled={isSignInPending}
        />
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </div>
  );
}
