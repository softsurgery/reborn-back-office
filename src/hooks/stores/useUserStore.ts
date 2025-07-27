import { create } from "zustand";
import {
  CreateUserDto,
  createUserDtoFactory,
  ResponseUserDto,
  UpdateUserDto,
  updateUserDtoFactory,
} from "@/types";
import { setDeepValue } from "@/lib/object.util";

interface UserStoreData {
  response?: ResponseUserDto;
  createDto: CreateUserDto;
  updateDto: UpdateUserDto;
  setManualPassword: boolean;
  confirmPassword?: string;
  createDtoErrors: Record<string, any>;
  updateDtoErrors: Record<string, any>;
}

export interface UserStore extends UserStoreData {
  set: <T>(name: keyof UserStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: UserStoreData = {
  createDto: createUserDtoFactory(),
  updateDto: updateUserDtoFactory(),
  setManualPassword: false,
  confirmPassword: "",
  createDtoErrors: {},
  updateDtoErrors: {},
};

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
