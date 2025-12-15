"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api";

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            hasHydrated: false,
            setAuth: (user, token = null) => {
                if (token) {
                    localStorage.setItem("token", token);
                }
                set({ user, token });
            },
            logout: async () => {
                try {
                    await api.post("/auth/logout");
                } catch (err) {
                    console.error("Logout error:", err);
                } finally {
                    localStorage.removeItem("token");
                    set({ user: null, token: null });
                }
            },
        }),
        {
            name: "auth-storage",
            onRehydrateStorage: () => () => {
                useAuthStore.setState({ hasHydrated: true });
            },
        }
    )
);
