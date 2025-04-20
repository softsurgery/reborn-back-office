import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export const SignoutButton = () => {
  const completeSignOut = async () => {
    await signOut({ callbackUrl: "/auth" });
  };
  return (
    <Button onClick={completeSignOut} size={"sm"}>
      Sign out
    </Button>
  );
};
