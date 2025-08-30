import { create } from "zustand";
import {
  CreateUserDto,
  ResponseFollowCountsDto,
  ResponseFollowDto,
  ResponseUserDto,
  UpdateUserDto,
} from "@/types";
import { setDeepValue } from "@/lib/object.util";

interface UserStoreData {
  response?: ResponseUserDto;
  responseFollowCountsDto: ResponseFollowCountsDto;
  createDto: CreateUserDto;
  updateDto: UpdateUserDto;
  setManualPassword: boolean;
  confirmPassword?: string;
  picture?: File;
  pictureUrl?: string;
  progress?: number;
  followers: ResponseFollowDto[];
  following: ResponseFollowDto[];
  createDtoErrors: Record<string, any>;
  updateDtoErrors: Record<string, any>;
}

const initialState: UserStoreData = {
  response: undefined,
  responseFollowCountsDto: {
    followers: 0,
    following: 0,
  },
  createDto: {
    firstName: "",
    lastName: "",
    dateOfBirth: undefined,
    isActive: true,
    isApproved: true,
    password: "",
    username: "",
    email: "",
    roleId: "",
    profile: {
      phone: "",
      cin: "",
      bio: "",
      gender: undefined,
      isPrivate: false,
      regionId: undefined,
    },
  },
  updateDto: {
    firstName: "",
    lastName: "",
    dateOfBirth: undefined,
    isActive: true,
    isApproved: true,
    password: "",
    username: "",
    email: "",
    roleId: "",
    profile: {
      phone: "",
      cin: "",
      bio: "",
      gender: undefined,
      isPrivate: false,
      regionId: undefined,
    },
  },
  setManualPassword: false,
  confirmPassword: "",
  picture: undefined,
  progress: 0,
  followers: [],
  following: [],
  createDtoErrors: {},
  updateDtoErrors: {},
};

export interface UserStore extends UserStoreData {
  set: <T>(name: keyof UserStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  ...initialState,
  set: (name, value) => {
    set((state) => ({
      ...state,
      [name]: value,
    }));
  },
  setNested: (path, value) => {
    const [rootKey, ...restPath] = path.split(".");
    const nestedPath = restPath.join(".");
    set((state) => {
      const updatedRoot = setDeepValue(
        { ...(state[rootKey as keyof UserStoreData] as object) },
        nestedPath,
        value
      );
      return {
        ...state,
        [rootKey]: updatedRoot,
      };
    });
  },

  reset: () => {
    set({ ...initialState });
  },
}));
