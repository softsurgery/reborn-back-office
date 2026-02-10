import { useUserStore } from "@/hooks/stores/useUserStore";
import { Experience } from "../experience/Experience";
import { Education } from "../education/Education";
import React from "react";

interface BookProps {
  className?: string;
}

export const Book = ({ className }: BookProps) => {
  const userStore = useUserStore();
  const user = React.useMemo(() => userStore.response, [userStore.response]);

  return (
    <div className="overflow-auto no-scrollbar">
      <div className={className}>
        {user?.id && <Experience userId={user.id} className="w-full" />}
      </div>

      <div className={className}>
        {user?.id && <Education userId={user.id} className="w-full" />}
      </div>
    </div>
  );
};
