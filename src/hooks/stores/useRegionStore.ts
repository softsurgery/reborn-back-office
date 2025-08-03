import { create } from "zustand";
import {
  CreateRegionDto,
  ResponseRegionDto,
  UpdateRegionDto,
} from "@/types";
import { setDeepValue } from "@/lib/object.util";

interface RegionStoreData {
  response?: ResponseRegionDto;
  createDto: CreateRegionDto;
  updateDto: UpdateRegionDto;
  createDtoErrors: Record<string, string[]>;
  updateDtoErrors: Record<string, string[]>;
}

export interface RegionStore extends RegionStoreData {
  set: <K extends keyof RegionStoreData>(
    name: K,
    value: RegionStoreData[K]
  ) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: RegionStoreData = {
  createDto: {
    label: "",
  },
  updateDto: {
    label: "",
  },
  createDtoErrors: {},
  updateDtoErrors: {},
};

export const useRegionStore = create<RegionStore>((set, get) => ({
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
        { ...state[rootKey as keyof RegionStoreData] },
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
