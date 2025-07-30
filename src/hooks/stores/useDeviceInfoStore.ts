import { setDeepValue } from "@/lib/object.util";
import { CreateDeviceInfoDto, ResponseDeviceInfoDto } from "@/types";
import { create } from "zustand";

interface DeviceInfoStoreData {
  response?: ResponseDeviceInfoDto;
  createDto: CreateDeviceInfoDto;
  createDtoErrors?: Record<string, string[]>;

}

interface DeviceInfoStore extends DeviceInfoStoreData {
  set: <T>(name: keyof DeviceInfoStore, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: DeviceInfoStoreData = {
  createDto: {
    model: undefined,
    platform: undefined,
    version: undefined,
    manufacturer: undefined,
  },
  createDtoErrors: {},
};

export const useDeviceInfoStore = create<DeviceInfoStore>((set, get) => ({
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
        { ...state[rootKey as keyof DeviceInfoStore] },
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
