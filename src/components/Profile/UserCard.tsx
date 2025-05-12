import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  identifyUser,
  identifyUserAvatar,
} from "@/lib/users-management/utils/identify-user.util";
import { User } from "@/prisma/interfaces";
import { CalendarDays, Link, Mail, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface UserCardProps {
  className?: string;
  user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4 border">
            <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
            <AvatarFallback>{identifyUserAvatar(user)}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{identifyUser(user)}</h2>
          <p className="text-muted-foreground">@{user?.username}</p>
          <div className="flex items-center mt-2 text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">San Francisco, CA</span>
          </div>
          <div className="mt-4 w-full">
            <Button className="w-full">Edit Profile</Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              Joined{" "}
              {user?.createdAt &&
                format(new Date(user?.createdAt), "MMM dd, yyyy")}
            </span>
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <h3 className="font-medium mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">UI Design</Badge>
            <Badge variant="secondary">UX Research</Badge>
            <Badge variant="secondary">Prototyping</Badge>
            <Badge variant="secondary">Figma</Badge>
            <Badge variant="secondary">User Testing</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
