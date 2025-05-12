import React from "react";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useIntro } from "@/context/IntroContext";
import { useCurrentUser } from "@/hooks/content/useCurrentUser";
import {
  identifyUser,
  identifyUserAvatar,
} from "@/lib/users-management/utils/identify-user.util";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  BarChart2,
  CalendarDays,
  Edit,
  Link,
  Mail,
  MapPin,
  Settings,
  User,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { UserCard } from "./UserCard";
import { Spinner } from "../Common/Spinner";

export const Profile = () => {
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  const { user, isFetchUserPending } = useCurrentUser();

  if (!user || isFetchUserPending) {
    return <Spinner className="h-screen" />;
  }
  return (
    <div className="flex flex-col flex-1 overflow-auto container mx-auto my-5 h-full">
      <div className="grid grid-cols-1 2xl:grid-cols-4 gap-10">
        {/* Profile Sidebar */}
        <div className="2xl:col-span-1">
          <UserCard user={user} />
        </div>

        {/* Main Content */}
        <div className="2xl:col-span-3">
          <Tabs defaultValue="about">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="about" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>About</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>Activity</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                  <CardDescription>
                    Personal information and bio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Bio</h3>
                    <p className="text-muted-foreground">
                      Product designer with over 5 years of experience in
                      creating user-centered digital experiences. Passionate
                      about solving complex problems through design thinking and
                      collaborative approaches.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Work</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="font-medium">
                          Senior Product Designer
                        </div>
                        <div className="text-muted-foreground">
                          Design Company Inc.
                        </div>
                        <div className="text-sm text-muted-foreground">
                          2021 - Present
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">UX Designer</div>
                        <div className="text-muted-foreground">
                          Tech Startup Ltd.
                        </div>
                        <div className="text-sm text-muted-foreground">
                          2018 - 2021
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Education</h3>
                    <div>
                      <div className="font-medium">Bachelor of Design</div>
                      <div className="text-muted-foreground">
                        Design University
                      </div>
                      <div className="text-sm text-muted-foreground">
                        2014 - 2018
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                  <CardDescription>
                    Your recent activity and statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">28</div>
                          <div className="text-sm text-muted-foreground">
                            Projects
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">142</div>
                          <div className="text-sm text-muted-foreground">
                            Followers
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">97</div>
                          <div className="text-sm text-muted-foreground">
                            Following
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 pb-4 border-b"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p>
                            <span className="font-medium">Jane Doe</span>{" "}
                            completed a new project
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
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Account</h3>
                    <p className="text-muted-foreground">
                      Update your account information
                    </p>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Account
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Privacy</h3>
                    <p className="text-muted-foreground">
                      Manage your privacy settings
                    </p>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Privacy Settings
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Notifications</h3>
                    <p className="text-muted-foreground">
                      Configure your notification preferences
                    </p>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Notification Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
