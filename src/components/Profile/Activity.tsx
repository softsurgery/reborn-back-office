import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivityProps {
  className?: string;
}

export const Activity = ({ className }: ActivityProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Your recent activity and statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">28</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">142</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">97</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 pb-4 border-b">
              <Avatar className="h-10 w-10">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p>
                  <span className="font-medium">Jane Doe</span> completed a new
                  project
                </p>
                <p className="text-sm text-muted-foreground">
                  Dashboard UI Design
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {i} day{i !== 1 ? "s" : ""} ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
