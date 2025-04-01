import { Bug, BugCategory } from "@/types/bug";
import { create } from "zustand";

interface BugManagerData {
  id?: number;
  title?: string;
  description?: string;
  category?: BugCategory;
}

interface BugManager extends BugManagerData {
  bugs: Bug[]; 
  setBugs: (bugs: Bug[]) => void; 
  removeBug: (id: number) => void; 
  set: (name: keyof BugManagerData, value: any) => void;
  reset: () => void;
  getBug: () => Partial<Bug>;
  setBug: (data: Partial<Bug>) => void;
}

const initialState: BugManagerData = {
  id: undefined,
  title: "",
  description: "",
  category: undefined,
};

export const useBugManager = create<BugManager>((set, get) => ({
  ...initialState,
  bugs: [], 

  setBugs: (bugs) => {
    set({ bugs });
  },

  removeBug: (id) => {
    set((state) => ({
      bugs: state.bugs.filter((bug) => bug.id !== id),
    }));
  },

  set: (name: keyof BugManager, value: any) => {
    set((state) => ({
      ...state,
      [name]: value,
    }));
  },

  reset: () => {
    set({ ...initialState });
  },

  getBug: () => {
    const data = get();
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
    };
  },

  setBug: (data: Partial<Bug>) => {
    set((state) => ({
      ...state,
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
    }));
  },
}));
