import { create } from "zustand";
import {
  CreateJobTagDto,
  ResponseJobTagDto,
  UpdateJobTagDto,
} from "@/types";
import { setDeepValue } from "@/lib/object.util";

interface JobTagStoreData {
  response?: ResponseJobTagDto;
  createDto: CreateJobTagDto;
  updateDto: UpdateJobTagDto;
  createDtoErrors: Record<string, string[]>;
  updateDtoErrors: Record<string, string[]>;
}

export interface JobTagStore extends JobTagStoreData {
  set: <K extends keyof JobTagStoreData>(
    name: K,
    value: JobTagStoreData[K]
  ) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: JobTagStoreData = {
  createDto: {
    label: "",
  },
  updateDto: {
    label: "",
  },
  createDtoErrors: {},
  updateDtoErrors: {},
};

export const useJobTagStore = create<JobTagStore>((set, get) => ({
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
        { ...state[rootKey as keyof JobTagStoreData] },
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
