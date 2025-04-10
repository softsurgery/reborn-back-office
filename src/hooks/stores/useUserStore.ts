import { User } from "@/types/user-management";
import { create } from "zustand";

interface UserStoreData extends Partial<User> {
  setManualPassword?: boolean;
  confirmPassword?: string;
  errors: Record<string, string[]>;
}

interface UserStore extends UserStoreData {
  set: (name: keyof UserStoreData, value: any) => void;
  resetError: (name?: keyof UserStoreData) => void;
  reset: () => void;
  getUser: () => Partial<User>;
  setUser: (data: Partial<User>) => void;
}

const initialState: UserStoreData = {
  id: "",
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  dateOfBirth: null,
  roleId: undefined,
  password: "",
  setManualPassword: false,
  confirmPassword: "",
  errors: {},
};

export const useUserStore = create<UserStore>((set, get) => ({
  ...initialState,

  set: (name: keyof UserStoreData, value: any) => {
    set((state) => ({
      ...state,
      [name]: value,
    }));
  },
  resetError: (name?: keyof UserStoreData) => {
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

  getUser: () => {
    const data = get();
    return {
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      roleId: data.roleId,
    };
  },

  setUser: (data: Partial<User>) => {
    set((state) => ({
      ...state,
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      roleId: data.roleId,
    }));
  },
}));
