"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api";

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            /**
             * Sets the authentication state with user data and optional token.
             * Stores the token in localStorage if provided and updates the store state.
             *
             * @param {Object|null} user - The user object to store, or null to clear
             * @param {string|null} [token=null] - The authentication token to store, or null
             * @returns {void}
             */
            setAuth: (user, token = null) => {
                if (token) {
                    localStorage.setItem("token", token);
                }
                set({ user, token });
            },
            /**
             * Logs out the user by calling the logout API endpoint and clearing auth state.
             * Removes token from localStorage and resets user and token in the store.
             *
             * @async
             * @function logout
             * @returns {Promise<void>} Resolves when logout is complete
             *
             * @throws {Error} If API request fails - logs error to console but still clears local state
             */
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
        { name: "auth-storage" }
    )
);
