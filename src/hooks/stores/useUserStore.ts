import { create } from "zustand";
import {
  CreateUserDto,
  ResponseFollowCountsDto,
  ResponseFollowDto,
  ResponseUserDto,
  UpdateUserDto,
} from "@/types";
import { setDeepValue } from "@/lib/object.util";
import { ImageFile } from "@/components/shared/form-builder/types";

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
  followings: ResponseFollowDto[];
  images: ImageFile[];
  hasInitializedImages: boolean;
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
      uploads: [],
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
      uploads: [],
    },
  },
  setManualPassword: false,
  confirmPassword: "",
  picture: undefined,
  progress: 0,
  followers: [],
  followings: [],
  images: [],
  hasInitializedImages: false,
  createDtoErrors: {},
  updateDtoErrors: {},
};

export interface UserStore extends UserStoreData {
  set: <T>(name: keyof UserStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;

  setImageProgress: (file: File, progress: number) => void;
  appendUploadId: (
    dto: "create" | "update",
    upload: { id?: number; uploadId: number }
  ) => void;
  updateImages: (dto: "create" | "update", newImages: ImageFile[]) => void;
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

  setImageProgress: (file, progress) => {
    set((state) => ({
      ...state,
      images: state.images.map((image) =>
        image.image === file ? { ...image, progress } : image
      ),
    }));
  },

  appendUploadId: (dto, upload) => {
    set((state) => ({
      ...state,
      [`${dto}Dto`]: {
        ...state[`${dto}Dto`],
        profile: {
          ...state[`${dto}Dto`].profile,
          uploads: [...(state[`${dto}Dto`].profile?.uploads ?? []), upload],
        },
      },
    }));
  },

  updateImages: (dto: "create" | "update", newImages: ImageFile[]) => {
    set((state) => {
      const oldImages = state.images;
      const oldUploads = state[`${dto}Dto`].profile?.uploads ?? [];

      const uploadMap = new Map<string, { id?: number; uploadId: number }>();
      oldImages.forEach((img, idx) => {
        const upload = oldUploads[idx];
        if (upload?.uploadId) uploadMap.set(img.id, upload);
      });

      const newUploads = newImages
        .map((img) => {
          const existingUpload = uploadMap.get(img.id);
          if (existingUpload) {
            return existingUpload;
          }
          return undefined;
        })
        .filter(Boolean) as { id?: number; uploadId: number }[];

      return {
        ...state,
        images: newImages,
        [`${dto}Dto`]: {
          ...state[`${dto}Dto`],
          profile: {
            ...state[`${dto}Dto`].profile,
            uploads: newUploads,
          },
        },
      };
    });
  },

  reset: () => {
    set({ ...initialState });
  },
}));
