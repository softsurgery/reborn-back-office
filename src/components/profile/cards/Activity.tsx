import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logger } from "@/components/audit-monitoring/logger/Logger";

interface ActivityProps {
  className?: string;
  userId?: string;
}

export const Activity = ({ className, userId }: ActivityProps) => {
  return (
    // <Card className={className}>
    //   <CardHeader>
    //     <CardTitle>Activity</CardTitle>
    //     <CardDescription>Your recent activity and statistics</CardDescription>
    //   </CardHeader>
    //   <CardContent>
    <Logger userId={userId} className={className} />
    //  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    //           <Card>
    //             <CardContent className="pt-6">
    //               <div className="text-center">
    //                 <div className="text-3xl font-bold">28</div>
    //                 <div className="text-sm text-muted-foreground">Projects</div>
    //               </div>
    //             </CardContent>
    //           </Card>
    //           <Card>
    //             <CardContent className="pt-6">
    //               <div className="text-center">
    //                 <div className="text-3xl font-bold">142</div>
    //                 <div className="text-sm text-muted-foreground">Followers</div>
    //               </div>
    //             </CardContent>
    //           </Card>
    //           <Card>
    //             <CardContent className="pt-6">
    //               <div className="text-center">
    //                 <div className="text-3xl font-bold">97</div>
    //                 <div className="text-sm text-muted-foreground">Following</div>
    //               </div>
    //             </CardContent>
    //           </Card>
    //         </div>
    //   </CardContent>
    // </Card>
  );
};
