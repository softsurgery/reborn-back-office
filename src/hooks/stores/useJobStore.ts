import { create } from "zustand";
import { CreateJobDto, ResponseJobDto, UpdateJobDto } from "@/types";
import { setDeepValue } from "@/lib/object.util";

interface JobStoreData {
  response?: ResponseJobDto;
  createDto: CreateJobDto;
  updateDto: UpdateJobDto;
  createDtoErrors: Record<string, string[]>;
  updateDtoErrors: Record<string, string[]>;
}

export interface JobStore extends JobStoreData {
  set: <K extends keyof JobStoreData>(name: K, value: JobStoreData[K]) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: JobStoreData = {
  createDto: {
    title: "",
    description: "",
    price: 0,
    currencyId: undefined,
    jobTagIds: [],
  },
  updateDto: {
    title: "",
    description: "",
    price: 0,
    currencyId: undefined,
    jobTagIds: [],
  },
  createDtoErrors: {},
  updateDtoErrors: {},
};

export const useJobStore = create<JobStore>((set, get) => ({
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
        { ...state[rootKey as keyof JobStoreData] },
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
