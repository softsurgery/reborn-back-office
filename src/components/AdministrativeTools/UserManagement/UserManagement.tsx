import { Lock, PackageCheck, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import SidebarNav from '@/components/Common/SidebarNav';

interface UserManagementProps {
    className?: string;
    children?: React.ReactNode;
}

export default function UserManagement({ className, children }: UserManagementProps) {
    //translations

    //menu items
    const sidebarNavItems = [
        {
            title: "Users",
            icon: <Users size={18} />,
            href: '/users-management/users'
        },
        {
            title: "Roles",
            icon: <PackageCheck size={18} />,
            href: '/users-management/roles'
        },
        {
            title: "Permissions",
            icon: <Lock size={18} />,
            href: '/users-management/permissions'
        }
    ];

    return (
        <div className={cn('flex-1 flex flex-col overflow-hidden m-5 lg:mx-10', className)}>
            <div className="space-y-0.5 py-5 sm:py-0">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    User Management
                </h1>
                <p className="text-muted-foreground">
                    Manage users, roles, and permissions within your organization.
                </p>
            </div>
            <Separator className="my-4 lg:my-6" />
            <div className="flex-1 flex flex-col overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 ">
                <aside className="flex-1 mb-2">
                    <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className="flex flex-col flex-[7] overflow-hidden">{children}</div>
            </div>
        </div>
    );
}