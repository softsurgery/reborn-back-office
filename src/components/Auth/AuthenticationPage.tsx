import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import React from "react";
import { Spinner } from "../Common/Spinner";
import { ConnectComponent } from "./ConnectComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface AuthenticationPageProps {
    className?: string;
}

export default function AuthenticationPage({ className }: AuthenticationPageProps) {
    const router = useRouter();
    const authContext = React.useContext(AuthContext);
    React.useEffect(() => {
        if (authContext.authenticated) router.reload();
    }, []);
    return (
        <div className={`flex h-screen items-center justify-center ${className || ""}`}>
            <Tabs defaultValue="connect" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="connect">Connect</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="connect">
                    <ConnectComponent />
                </TabsContent>
                <TabsContent value="register">

                </TabsContent>
            </Tabs>
        </div>
    );
}

