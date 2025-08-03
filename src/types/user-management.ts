import { ResponseRegionDto } from "./content";
import { DatabaseEntity } from "./utils/database-entity";

export interface ResponseUserDto extends DatabaseEntity {
  id: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  isActive?: boolean;
  isApproved?: boolean;
  username: string;
  email: string;
  emailVerified?: Date;
  role: ResponseRoleDto;
  roleId: string;
  profile: ResponseProfileDto;
  profileId: string;
}

export interface CreateUserDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  isActive?: boolean;
  isApproved?: boolean;
  password?: string;
  username: string;
  email: string;
  roleId?: string;
  profile?: CreateProfileDto;
}

export const createUserDtoFactory = (): CreateUserDto => ({
  firstName: "",
  lastName: "",
  dateOfBirth: undefined,
  isActive: true,
  isApproved: false,
  password: "",
  username: "",
  email: "",
  roleId: undefined,
});

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export const updateUserDtoFactory = (): UpdateUserDto => ({
  firstName: "",
  lastName: "",
  dateOfBirth: undefined,
  isActive: true,
  isApproved: false,
  password: "",
  username: "",
  email: "",
  roleId: undefined,
});

export interface ResponseRoleDto extends DatabaseEntity {
  id: string;
  label: string;
  description?: string;
  permissions: ResponseRolePermissionDto[];
}

export interface ResponseRolePermissionDto {
  id: number;
  role?: ResponseRoleDto;
  roleId: string;
  permission?: ResponsePermissionDto;
  permissionId: string;
}

export interface CreateRoleDto {
  label: string;
  description?: string;
  permissions: { permissionId: string }[];
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {}

export interface ResponsePermissionDto extends DatabaseEntity {
  id: string;
  label: string;
  description?: string;
  roles?: ResponseRolePermissionDto[];
}

export interface RequestResetTokenDto {
  usernameOrEmail: string;
}
export interface ResponseResetTokenDto {
  email: string;
  success: boolean;
}

export enum Gender {
  Male = "Male",
  Female = "Female",
}

export interface ResponseProfileDto extends DatabaseEntity {
  id: number;
  phone?: string;
  cin?: string;
  bio?: string;
  gender?: Gender;
  isPrivate?: boolean;
  region?: ResponseRegionDto;
  regionId?: number;
  user: ResponseUserDto;
}

export interface CreateProfileDto {
  phone?: string;
  cin?: string;
  bio?: string;
  gender?: Gender;
  isPrivate?: boolean;
  regionId?: number;
}

export interface UpdateProfileDto extends Partial<CreateProfileDto> {}
