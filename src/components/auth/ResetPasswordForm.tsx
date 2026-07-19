import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";
import { ServerResponse } from "@/types";
import { PasswordField } from "../shared/form-builder/PasswordField";

interface ResetPasswordFormProps {
  className?: string;
  token: string | null;
  goToAuthentication: () => void;
}

export const ResetPasswordForm = ({
  className,
  token,
  goToAuthentication,
}: ResetPasswordFormProps) => {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: async () => {
      const result = await api.auth.resetPassword(token as string, password);
      return {
        code: 200,
        message: result.message,
        data: undefined,
      } as ServerResponse<undefined>;
    },
    onSuccess: (data: ServerResponse) => {
      toast.success(data.message);
      goToAuthentication();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to reset password";
      toast.error(message);
    },
  });

  const handleSubmit = async () => {
    if (!password) {
      toast.error("Please enter a password");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    resetPassword();
  };

  return (
    <div className={cn("flex flex-col gap-6 w-[350px]", className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your new password below.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <PasswordField
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isPending}
          />
        </div>
        {password != confirmPassword && (
          <span className="font-medium text-xs text-red-500 leading-3">
            Password does not match
          </span>
        )}

        <div className="flex flex-row gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={goToAuthentication}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isPending}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
