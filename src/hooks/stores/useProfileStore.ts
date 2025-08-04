import { create } from "zustand";
import {
  CreateProfileDto,
  createProfileDtoFactory,
  ResponseProfileDto,
  UpdateProfileDto,
  updateProfileDtoFactory,
} from "@/types";
import { setDeepValue } from "@/lib/object.util";

interface ProfileStoreData {
  response?: ResponseProfileDto;
  createDto: CreateProfileDto;
  updateDto: UpdateProfileDto;
  createDtoErrors: Record<string, any>;
  updateDtoErrors: Record<string, any>;
}

export interface ProfileStore extends ProfileStoreData {
  set: <T>(name: keyof ProfileStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: ProfileStoreData = {
  createDto: createProfileDtoFactory(),
  updateDto: updateProfileDtoFactory(),
  createDtoErrors: {},
  updateDtoErrors: {},
};

export const useProfileStore = create<ProfileStore>((set, get) => ({
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
        { ...(state[rootKey as keyof ProfileStoreData] as object) },
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
