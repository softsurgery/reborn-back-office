import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthPersistData {
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
}

interface AuthPersistStore extends AuthPersistData {
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setAuthenticated: (isAuth: boolean) => void;
  logout: () => void;
}

const authPersistStore: AuthPersistData = {
  accessToken: "",
  refreshToken: "",
  isAuthenticated: false,
};

export const useAuthPersistStore = create(
  persist<AuthPersistStore>(
    (set) => ({
      ...authPersistStore,
      setAccessToken: (token: string) => set({ accessToken: token }),
      setRefreshToken: (token: string) => set({ refreshToken: token }),
      setAuthenticated: (isAuth: boolean) => set({ isAuthenticated: isAuth }),
      logout: () => set(authPersistStore),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
