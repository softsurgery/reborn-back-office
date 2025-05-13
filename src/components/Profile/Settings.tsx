import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SettingsProps {
  className?: string;
}

export const Settings = ({ className }: SettingsProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Account</h3>
          <p className="text-muted-foreground">
            Update your account information
          </p>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Account
          </Button>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Privacy</h3>
          <p className="text-muted-foreground">Manage your privacy settings</p>
          <Button variant="outline" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Privacy Settings
          </Button>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Notifications</h3>
          <p className="text-muted-foreground">
            Configure your notification preferences
          </p>
          <Button variant="outline" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Notification Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
