import Roles from "@/components/AdministrativeTools/UserManagement/Roles/Roles";
import UserManagement from "@/components/AdministrativeTools/UserManagement/UserManagement";

export default function page() {
    return (
        <UserManagement>
            <Roles />
        </UserManagement>
    )
}