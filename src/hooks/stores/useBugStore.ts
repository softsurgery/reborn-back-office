import { setDeepValue } from "@/lib/object.util";
import { ResponseBugDto } from "@/types/system-reports";
import { create } from "zustand";

interface BugData {
  response?: ResponseBugDto;
}

interface BugStore extends BugData {
  set: <K extends keyof BugData>(name: K, value: BugData[K]) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: BugData = {};

export const useBugStore = create<BugStore>((set, get) => ({
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
        { ...state[rootKey as keyof BugStore] },
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
