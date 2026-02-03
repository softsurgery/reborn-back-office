import { create } from "zustand";
import {
  CreateExperienceDto,
  ResponseExperienceDto,
  UpdateExperienceDto,
} from "@/types";
import { setDeepValue } from "@/lib/object.util";

interface ExperienceStoreData {
  response?: ResponseExperienceDto;
  createDto: CreateExperienceDto;
  updateDto: UpdateExperienceDto;
  createDtoErrors: Record<string, string[]>;
  updateDtoErrors: Record<string, string[]>;
}

const initialState: ExperienceStoreData = {
  response: undefined,
  createDto: {
    title: "",
    company: "",
    startDate: undefined,
    endDate: undefined,
    description: "",
  },
  updateDto: {
    title: "",
    company: "",
    startDate: undefined,
    endDate: undefined,
    description: "",
  },
  createDtoErrors: {},
  updateDtoErrors: {},
};

export interface ExperienceStore extends ExperienceStoreData {
  set: <T>(name: keyof ExperienceStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

export const useExperienceStore = create<ExperienceStore>((set) => ({
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
        { ...(state[rootKey as keyof ExperienceStoreData] as object) },
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
