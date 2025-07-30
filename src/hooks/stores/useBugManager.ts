import { setDeepValue } from "@/lib/object.util";
import { ResponseBugDto, CreateBugDto } from "@/types/bug";
import { create } from "zustand";

interface BugManagerData {
  response?: ResponseBugDto;
  createDto: CreateBugDto;
  createDtoErrors?: Record<string, string[]>;
}

interface BugManager extends BugManagerData {
  set: <T>(name: keyof BugManagerData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: BugManagerData = {
  createDto: {
    title: "",
    description: "",
    category: "Other",
    deviceId: 0,
  },
  createDtoErrors: {},
};

export const useBugManager = create<BugManager>((set, get) => ({
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
        { ...state[rootKey as keyof BugManager] },
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
