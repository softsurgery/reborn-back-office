import { ResponseRefParamDto } from "./reference-types";
import { Upload } from "./upload";
import { DatabaseEntity } from "./utils/database-entity";

//abstract user dtos *****************************************************************************

export interface ResponseAbstractUserDto extends DatabaseEntity {
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
}

export interface CreateAbstractUserDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  isActive?: boolean;
  isApproved?: boolean;
  password?: string;
  username: string;
  email: string;
  roleId?: string;
}

export interface UpdateAbstractUserDto extends Partial<CreateAbstractUserDto> {}

// user dtos ************************************************************************************

export interface ResponseUserDto extends ResponseAbstractUserDto {
  phone?: string;
  cin?: string;
  bio?: string;
  gender?: Gender;
  isPrivate?: boolean;

  pictureId?: number;
  picture?: Upload;

  region?: ResponseRefParamDto;
  regionId?: number;

  uploads: ResponseUserUploadDto[];
}

export interface CreateUserDto extends CreateAbstractUserDto {
  phone?: string;
  cin?: string;
  bio?: string;
  gender?: Gender;
  isPrivate?: boolean;
  pictureId?: number;
  regionId?: number;
  uploads?: { uploadId: number }[];
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  uploads?: { id: number; uploadId: number }[];
}

export interface ResponseUserUploadDto extends DatabaseEntity {
  id: number;
  userId: string;
  user: ResponseUserDto;
  uploadId: number;
  upload: Upload;
  order: number;
}

// user experience dtos ************************************************************************************
export interface ResponseExperienceDto extends DatabaseEntity {
  id: number;
  title?: string;
  company?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  user?: ResponseUserDto;
  userId: string;
}

export interface CreateExperienceDto {
  title?: string;
  company?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
}

export interface UpdateExperienceDto extends Partial<CreateExperienceDto> {}

// user education dtos ************************************************************************************

export interface ResponseEducationDto extends DatabaseEntity {
  id: string;
  title?: string;
  startDate?: Date;
  endDate?: Date;
  institution?: string;
  description?: string;
  user?: ResponseUserDto;
  userId: string;
}

export interface CreateEducationDto {
  title?: string;
  startDate?: Date;
  endDate?: Date;
  institution?: string;
  description?: string;
}

export interface UpdateEducationDto extends Partial<CreateEducationDto> {}

// ********************************************************************************************

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
