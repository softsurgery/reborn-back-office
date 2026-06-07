import { create } from "zustand";
import {
  ResponseConfigurationParamDto,
  UpdateConfigurationParameterDto,
} from "@/types";
import { setDeepValue } from "@/lib/object.util";

interface ConfigStoreData {
  response?: ResponseConfigurationParamDto[];

  updateDtos: UpdateConfigurationParameterDto[];
  updateDtoErrors: Record<string, string[]>;
}

const initialState: ConfigStoreData = {
  updateDtos: [],
  updateDtoErrors: {},
};

export interface ConfigStore extends ConfigStoreData {
  set: <T>(name: keyof ConfigStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
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
        { ...(state[rootKey as keyof ConfigStoreData] as object) },
        nestedPath,
        value,
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
