import {
  CreateRefParamDto,
  CreateRefTypeDto,
  ResponseRefParamDto,
  ResponseRefTypeDto,
  UpdateRefParamDto,
  UpdateRefTypeDto,
} from "@/types";
import { create } from "zustand";

interface ReferenceTypesStoreData {
  refType?: ResponseRefTypeDto;
  refParam?: ResponseRefParamDto;
  refTypeCreateDto: CreateRefTypeDto;
  refTypeUpdateDto: UpdateRefTypeDto;
  refParamCreateDto: CreateRefParamDto;
  refParamUpdateDto: UpdateRefParamDto;
  refTypeCreateDtoErrors: Record<string, string[]>;
  refTypeUpdateDtoErrors: Record<string, string[]>;
  refParamCreateDtoErrors: Record<string, string[]>;
  refParamUpdateDtoErrors: Record<string, string[]>;
}

export interface ReferenceTypesStore extends ReferenceTypesStoreData {
  set: <T>(name: keyof ReferenceTypesStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: ReferenceTypesStoreData = {
  refTypeCreateDto: {
    label: "",
    description: "",
    parentId: undefined,
  },
  refTypeUpdateDto: {},
  refParamCreateDto: {
    label: "",
    description: "",
    refTypeId: undefined,
    extras: {},
  },
  refParamUpdateDto: {},
  refTypeCreateDtoErrors: {},
  refTypeUpdateDtoErrors: {},
  refParamCreateDtoErrors: {},
  refParamUpdateDtoErrors: {},
};

export const useReferenceTypesStore = create<ReferenceTypesStore>(
  (set, get) => ({
    ...initialState,

    set: (name, value) => {
      set((state) => ({
        ...state,
        [name]: value,
      }));
    },

    setNested: (path, value) => {
      set((state) => {
        const keys = path.split(".");
        const newState = { ...state };
        let current: any = newState;
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (typeof current[key] !== "object" || current[key] === null) {
            current[key] = {};
          } else {
            current[key] = { ...current[key] };
          }
          current = current[key];
        }

        current[keys[keys.length - 1]] = value;

        return newState;
      });
    },

    reset: () => {
      set({ ...initialState });
    },
  }),
);
