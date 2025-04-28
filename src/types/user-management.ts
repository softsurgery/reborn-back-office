import { Region } from "@prisma/client";
import { DatabaseEntity } from "./utils/database-entity";

export interface User extends DatabaseEntity {
  id: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: Date | null;
  isActive: boolean | null;
  password: string | null;
  username: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  roleId: string | null;
  role?: Role | null;
  isApproved: boolean;
  appUsers?: MobileUser[];
}

export interface MobileUser extends DatabaseEntity {
  id: number;
  userId: string;
  user?: User;
  regionId: number;
  region?: Region;
}

export interface SigninPayload {
  usernameOrEmail: string;
  password: string;
}

export interface Role extends DatabaseEntity {
  id: string;
  label: string;
  description: string | null;
  permissions?: RolePermission[];
  users?: User[];
}

export interface Permission extends DatabaseEntity {
  id: string;
  label: string;
  description: string | null;
  roles?: RolePermission[];
}

export interface RolePermission extends DatabaseEntity {
  id: number;
  roleId: string;
  permissionId: string;
  role?: Role;
  permission?: Permission;
}

export interface CardinalApiKey {
  id: string;
  name: string;
  key: string;
  active: boolean;
}
