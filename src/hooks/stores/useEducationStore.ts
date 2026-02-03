import { create } from "zustand";
import {
  CreateEducationDto,
  ResponseEducationDto,
  UpdateEducationDto,
} from "@/types";
import { setDeepValue } from "@/lib/object.util";

interface EducationStoreData {
  response?: ResponseEducationDto;
  createDto: CreateEducationDto;
  updateDto: UpdateEducationDto;
  createDtoErrors: Record<string, string[]>;
  updateDtoErrors: Record<string, string[]>;
}

const initialState: EducationStoreData = {
  response: undefined,
  createDto: {
    title: "",
    institution: "",
    startDate: undefined,
    endDate: undefined,
    description: "",
  },
  updateDto: {
    title: "",
    institution: "",
    startDate: undefined,
    endDate: undefined,
    description: "",
  },
  createDtoErrors: {},
  updateDtoErrors: {},
};

export interface EducationStore extends EducationStoreData {
  set: <T>(name: keyof EducationStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

export const useEducationStore = create<EducationStore>((set) => ({
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
        { ...(state[rootKey as keyof EducationStoreData] as object) },
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
