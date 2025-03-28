import { Feedback } from "@/types";
import { create } from "zustand";

interface FeedbackManagerData extends Partial<Feedback> {}

interface FeedbackManager extends FeedbackManagerData {
  set: (name: keyof FeedbackManagerData, value: any) => void;
  reset: () => void;
  getFeedback: () => Partial<Feedback>;
  setFeedback: (data: Partial<Feedback>) => void;
}

const initialState: FeedbackManagerData = {
  id: undefined,
  message: "",
  category: undefined,
  rating: 0,
};

export const useFeedbackManager = create<FeedbackManager>((set, get) => ({
  ...initialState,

  set: (name: keyof FeedbackManager, value: any) => {
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
        } as Partial<FeedbackManager>)
    );
  },
}));
