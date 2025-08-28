import { create } from "zustand";
import {
  CreateJobCategoryDto,
  ResponseJobCategoryDto,
  UpdateJobCategoryDto,
} from "@/types";
import { setDeepValue } from "@/lib/object.util";

interface JobCategoryStoreData {
  response?: ResponseJobCategoryDto;
  createDto: CreateJobCategoryDto;
  updateDto: UpdateJobCategoryDto;
  createDtoErrors: Record<string, string[]>;
  updateDtoErrors: Record<string, string[]>;
}

export interface JobCategoryStore extends JobCategoryStoreData {
  set: <K extends keyof JobCategoryStoreData>(
    name: K,
    value: JobCategoryStoreData[K]
  ) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: JobCategoryStoreData = {
  createDto: {
    label: "",
  },
  updateDto: {
    label: "",
  },
  createDtoErrors: {},
  updateDtoErrors: {},
};

export const useJobCategoryStore = create<JobCategoryStore>((set, get) => ({
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
        { ...state[rootKey as keyof JobCategoryStoreData] },
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
