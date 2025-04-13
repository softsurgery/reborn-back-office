import { Feedback } from "@/types/feedback";
import { create } from "zustand";

interface DeviceInfoStoreData {
  id?: number;
  platform?: string | null;
  model?: string;
  version?: string | null;
  manufacturer?: string | null;
  feedbacks?: Feedback[];
}

interface DeviceInfoStore extends DeviceInfoStoreData {
  deviceInfos: DeviceInfoStoreData[];
  setDeviceInfos: (deviceInfos: DeviceInfoStoreData[]) => void;
  removeDeviceInfo: (id: number) => void;
  set: (name: keyof DeviceInfoStoreData, value: any) => void;
  reset: () => void;
  getDeviceInfo: () => Partial<DeviceInfoStoreData>;
  setDeviceInfo: (data: Partial<DeviceInfoStoreData>) => void;
}

const initialState: DeviceInfoStoreData = {
  id: undefined,
  platform: null,
  model: "",
  version: null,
  manufacturer: null,
  feedbacks: [],
};

export const useDeviceInfoStore = create<DeviceInfoStore>((set, get) => ({
  ...initialState,
  deviceInfos: [],

  setDeviceInfos: (deviceInfos) => {
    set({ deviceInfos });
  },

  removeDeviceInfo: (id) => {
    set((state) => ({
      deviceInfos: state.deviceInfos.filter(
        (deviceInfo) => deviceInfo.id !== id
      ),
    }));
  },

  set: (name: keyof DeviceInfoStoreData, value: any) => {
    set((state) => ({
      ...state,
      [name]: value,
    }));
  },

  reset: () => {
    set({ ...initialState });
  },

  getDeviceInfo: () => {
    const data = get();
    return {
      id: data.id,
      platform: data.platform,
      model: data.model,
      version: data.version,
      manufacturer: data.manufacturer,
      feedbacks: data.feedbacks,
    };
  },

  setDeviceInfo: (data: Partial<DeviceInfoStoreData>) => {
    set((state) => ({
      ...state,
      id: data.id,
      platform: data.platform,
      model: data.model,
      version: data.version,
      manufacturer: data.manufacturer,
      feedbacks: data.feedbacks,
    }));
  },
}));
