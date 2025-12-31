import { ResponseRefParamDto } from "./reference-types";
import { Upload } from "./upload";
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

export interface UpdateUserDto extends Partial<CreateUserDto> {}

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
  region?: ResponseRefParamDto;
  regionId?: number;
  user: ResponseUserDto;
  pictureId?: number;
  picture?: Upload;
  officialDocumentId?: number;
  officialDocument?: Upload;
  driverLicenseDocumentId?: number;
  driverLicenseDocument?: Upload;
  uploads: ResponseProfileUploadDto[];
}

export interface CreateProfileDto {
  phone?: string;
  cin?: string;
  bio?: string;
  gender?: Gender;
  isPrivate?: boolean;
  regionId?: number;
  pictureId?: number;
  officialDocumentId?: number;
  driverLicenseDocumentId?: number;
  uploads?: { uploadId: number }[];
}

export interface UpdateProfileDto extends Partial<CreateProfileDto> {
  uploads?: { id: number; uploadId: number }[];
}

export interface ResponseFollowDto extends DatabaseEntity {
  id: string;
  follower: ResponseUserDto;
  followerId: string;
  following: ResponseUserDto;
  followingId: string;
  isFollowing: boolean;
}

export interface ResponseFollowCountsDto {
  followers: number;
  following: number;
}

export interface ResponseIsFollowingDto {
  userId?: string;
  targetId?: string;
  isFollowing?: boolean;
}

export interface ResponseProfileUploadDto extends DatabaseEntity {
  id: number;
  profileId: number;
  profile: ResponseProfileDto;
  uploadId: number;
  upload: Upload;
  order: number;
}
