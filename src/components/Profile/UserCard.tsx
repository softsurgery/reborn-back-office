import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  identifyUser,
  identifyUserAvatar,
} from "@/lib/users-management/utils/identify-user.util";
import { cn } from "@/lib/utils";
import { ResponseUserDto } from "@/types";

interface UserCardProps {
  className?: string;
  user: ResponseUserDto;
}

export const UserCard = ({ className, user }: UserCardProps) => {
  return (
    <Card className={cn(className)}>
      <CardContent className="flex flex-col 2xl:flex-row items-center gap-4 pt-6">
        
        <div className="flex flex-row items-center justify-center w-full gap-5">
          <div>
            <Avatar className="h-24 w-24 border">
              <AvatarImage
                src="/placeholder.svg?height=96&width=96"
                alt="User"
              />
              <AvatarFallback>{identifyUserAvatar(user)}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="mb-2">
              <h2 className="font-bold">{identifyUser(user)}</h2>
              <p className="text-muted-foreground text-xs">@{user?.username}</p>
              <p className="text-muted-foreground text-xs">@{user?.email}</p>
            </div>
            <p className="font-extrabold text-xs">{user?.role?.label}</p>
          </div>
        </div>


        <div className="w-full hidden">
          
        </div>


        <div className="w-full hidden">
          {/* <h3 className="font-medium mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">UI Design</Badge>
            <Badge variant="secondary">UX Research</Badge>
            <Badge variant="secondary">Prototyping</Badge>
            <Badge variant="secondary">Figma</Badge>
            <Badge variant="secondary">User Testing</Badge>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};
