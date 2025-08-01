import { setDeepValue } from "@/lib/object.util";
import { ResponseFeedbackDto } from "@/types";
import { create } from "zustand";

interface FeedbackStoreData {
  response?: ResponseFeedbackDto;
}

interface FeedbackStore extends FeedbackStoreData {
  set: <K extends keyof FeedbackStoreData>(name: K, value: FeedbackStoreData[K]) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: FeedbackStoreData = {
  response: undefined,
};

export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
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
        { ...state[rootKey as keyof FeedbackStore] },
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
