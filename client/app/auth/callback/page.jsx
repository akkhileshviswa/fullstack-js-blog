"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../utils/api";

/**
 * AuthCallback component - Handles OAuth callback after authentication.
 * Fetches user profile from the server using cookies and updates auth state.
 *
 * @returns {JSX.Element} A loading message while authentication is being processed
 */
export default function AuthCallback() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        /**
         * Fetches the authenticated user's profile from the API using cookies.
         * Updates the auth state with user data and token, then redirects to profile.
         *
         * @async
         * @function fetchUser
         * @returns {Promise<void>} Resolves when user is fetched and auth state is updated
         *
         * @throws {Error} If API request fails - logs error to console and redirects to /signin
         * @throws {Error} If user is not authenticated or cookie is invalid or not set or server is down
         */
        const fetchUser = async () => {
            try {
                const res = await api.get("/auth/profile", {withCredentials: true});
                setAuth(res.data.user, res.data.token);
                router.push("/profile");
            } catch (err) {
                console.error("Failed to fetch user from cookie:", err);
                router.push("/signin");
            }
        };

        fetchUser();
    }, [setAuth, router]);

    return <p>Signing you in...</p>;
}
