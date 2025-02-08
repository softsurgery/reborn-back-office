import Permissions from "@/components/AdministrativeTools/UsersManagement/Permissions/Permissions";
import UserManagement from "@/components/AdministrativeTools/UsersManagement/UsersManagement";

export default function page() {
    return (
        <UserManagement>
            <Permissions/>
        </UserManagement>
    )
}