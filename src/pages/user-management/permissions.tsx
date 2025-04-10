import Permissions from "@/components/AdministrativeTools/UserManagement/Permissions/Permissions";
import UserManagement from "@/components/AdministrativeTools/UserManagement/UserManagement";

export default function page() {
    return (
        <UserManagement>
            <Permissions/>
        </UserManagement>
    )
}