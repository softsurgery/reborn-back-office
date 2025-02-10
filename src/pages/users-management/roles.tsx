import Roles from "@/components/AdministrativeTools/UserManagement/Roles/Roles";
import UserManagement from "@/components/AdministrativeTools/UserManagement/UserManagement";
import ComingSoon from "@/components/Common/CommingSoon";


export default function page() {
    return (
        <UserManagement>
            <Roles/>
        </UserManagement>
    )
}