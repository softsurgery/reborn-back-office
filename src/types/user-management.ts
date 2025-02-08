import { DatabaseEntity } from "./utilities/database-entity";

export interface User extends DatabaseEntity {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    isActive: boolean;
    password: string;
    username: string;
    email: string;
    emailVerified: Date;
    image: string;
    roleId: number;
    role?: Role;
    accounts?: Account[];
    sessions?: Session[];
}

export interface Account extends DatabaseEntity {
    id: string;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token: string;
    access_token: string;
    expires_at: number;
    token_type: string;
    scope: string;
    id_token: string;
    session_state: string;
    refresh_token_expires_in: number;
    user?: User;
}

export interface Session extends DatabaseEntity {
    id: string;
    sessionToken: string;
    userId: string;
    expires: Date;
    user?: User;
}

export interface VerificationToken {
    identifier: string;
    token: string;
    expires: Date;
}

export interface Role extends DatabaseEntity {
    id: number;
    label: string;
    description: string;
    permissions?: RolePermission[];
    users?: User[];
}

export interface CreateRoleDto {
    label?: string;
    description?: string;
    permissionIds?: number[];
}

export interface UpdateRoleDto extends CreateRoleDto { }

export interface Permission extends DatabaseEntity {
    id: number;
    label: string;
    description: string;
    roles?: RolePermission[];
}

export interface RolePermission extends DatabaseEntity {
    id: number;
    roleId: number;
    permissionId: number;
    role?: Role;
    permission?: Permission;
}