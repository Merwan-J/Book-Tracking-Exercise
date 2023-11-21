import { create } from "zustand";

type ThemeState = {
    theme: "light" | "dark";
    changeTheme: (theme: "light" | "dark") => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
    theme: "light",
    changeTheme: (theme) => set({ theme }),
}));
