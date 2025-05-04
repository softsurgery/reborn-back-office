import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ForgotPasswordFormProps {
  className?: string;
  goToAuthentication: () => void;
}

export const ForgotPasswordForm = ({
  className,
  goToAuthentication,
}: ForgotPasswordFormProps) => {
  const [usernameOrEmail, setUsernameOrEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!usernameOrEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail }),
      });

      if (!response.ok) throw new Error("Failed to send reset link.");
      toast.success("Password reset link sent to your email.");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-[350px]", className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email to receive a reset link.
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
          />
        </div>

        <div className="flex flex-row gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={goToAuthentication}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>
      </div>
    </div>
  );
};
