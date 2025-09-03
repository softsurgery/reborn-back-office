import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { cn } from "@/lib/utils";

interface AboutProps {
  className?: string;
}

export const About = ({ className }: AboutProps) => {
  const userStore = useUserStore();
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>
          {userStore.response?.profile?.bio || "No bio available"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
      </CardContent>
    </Card>
  );
};
