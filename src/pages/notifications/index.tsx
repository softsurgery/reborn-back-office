// src/pages/notifications/index.tsx
import React from "react";
import { Notifications } from "@/components/audit-monitoring/notifications/Notifications";
import { useCurrentUser } from "@/hooks/content/User/useCurrentUser"

export default function Page() {
  const { user } = useCurrentUser();

  if (!user) return null;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <Notifications userId={user.id} />
    </div>
  );
}
