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
        <CardDescription>Personal information and bio</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-bold mb-2">Bio</h3>
          <p className="text-muted-foreground">
            {userStore.response?.profile?.bio || "No bio available"}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Work</h3>
          <div className="space-y-4">
            <div>
              <div className="font-medium">Senior Product Designer</div>
              <div className="text-muted-foreground">Design Company Inc.</div>
              <div className="text-sm text-muted-foreground">
                2021 - Present
              </div>
            </div>
            <div>
              <div className="font-medium">UX Designer</div>
              <div className="text-muted-foreground">Tech Startup Ltd.</div>
              <div className="text-sm text-muted-foreground">2018 - 2021</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Education</h3>
          <div>
            <div className="font-medium">Bachelor of Design</div>
            <div className="text-muted-foreground">Design University</div>
            <div className="text-sm text-muted-foreground">2014 - 2018</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
