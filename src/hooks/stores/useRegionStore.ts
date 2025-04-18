import { create } from "zustand";
import { Region } from "@/types";

interface RegionStoreData extends Partial<Region> {
  id?: number;
  label: string;
  errors: Record<string, string[]>;
}

interface RegionStore extends RegionStoreData {
  set: (name: keyof RegionStoreData, value: any) => void;
  resetError: (name?: keyof RegionStoreData) => void;
  reset: () => void;
  getRegion: () => Partial<Region>;
  setRegion: (data: Partial<Region>) => void;
}

const initialState: RegionStoreData = {
  id: undefined,
  label: "",
  errors: {},
};

export const useRegionStore = create<RegionStore>((set, get) => ({
  ...initialState,

  set: (name: keyof RegionStoreData, value: any) => {
    set((state) => ({
      ...state,
      [name]: value,
    }));
  },
  resetError: (name?: keyof RegionStoreData) => {
    if (name)
      set((state) => ({
        ...state,
        errors: { ...state.errors, [name]: [] },
      }));
    else set((state) => ({ ...state, errors: {} }));
  },
  reset: () => {
    set({ ...initialState });
  },
  getRegion: () => {
    const data = get();
    return {
      id: data.id,
      label: data.label, 
    };
  },
  setRegion: (data: Partial<Region>) => {
    set((state) => ({
      ...state,
      id: data.id,
      label: data.label,
    }));
  },
}));
