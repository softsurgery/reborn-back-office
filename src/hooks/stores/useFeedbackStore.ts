import { Feedback } from "@/types";
import { create } from "zustand";

interface FeedbackStoreData extends Partial<Feedback> {}

interface FeedbackStore extends FeedbackStoreData {
  set: (name: keyof FeedbackStoreData, value: any) => void;
  reset: () => void;
  getFeedback: () => Partial<Feedback>;
  setFeedback: (data: Partial<Feedback>) => void;
}

const initialState: FeedbackStoreData = {
  id: undefined,
  message: "",
  category: undefined,
  rating: 0,
};

export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
  ...initialState,

  set: (name: keyof FeedbackStore, value: any) => {
    set((state) => ({
      ...state,
      [name]: value,
    }));
  },

  reset: () => {
    set({ ...initialState });
  },

  getFeedback: () => {
    const data = get();
    return {
      id: data.id,
      message: data.message,
      category: data.category,
      rating: data.rating,
    };
  },

  setFeedback: (data: Partial<Feedback>) => {
    set(
      (state) =>
        ({
          ...state,
          id: data.id,
          message: data.message,
          category: data.category,
          rating: data.rating,
        } as Partial<FeedbackStore>)
    );
  },
}));
