"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import api from "../utils/api";

/**
 * ProfilePage component - Displays the user's profile information.
 * Fetches and displays user profile data on mount.
 *
 * @returns {JSX.Element} The profile page component with user info and navigation buttons
 */
export default function ProfilePage() {
    const router = useRouter();
    const { logout } = useAuthStore();
    const [profile, setProfile] = useState(null);

    /**
     * Handles user logout by calling the logout function and redirecting to home.
     *
     * @async
     * @function handleLogout
     * @returns {Promise<void>} Resolves when logout is complete and navigation occurs
     */
    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    useEffect(() => {
        /**
         * Fetches the current user's profile data from the API.
         * Retrieves profile information and updates the component state.
         *
         * @async
         * @function fetchProfile
         * @returns {Promise<void>} Resolves when profile is fetched and state is updated
         *
         * @throws {Error} If API request fails - logs error to console
         * @throws {Error} If user is unauthorized (401) - redirects to /signin
         */
        const fetchProfile = async () => {
            try {
                const localToken = localStorage.getItem("token");

                const res = await api.get("/auth/profile", {
                    headers: localToken ? { Authorization: `Bearer ${localToken}` } : {},
                });
                setProfile(res.data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    router.push("/signin");
                }
            }
        };

        fetchProfile();
    }, [router]);

    if (!profile) return <p>Loading...</p>;

    return (
        <div className="max-w-md mx-auto mt-10 text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome, {profile.name}</h1>
            <button onClick={() => router.push("/posts")}
                className="bg-green-600 text-white py-2 mr-2.5 px-4 rounded hover:bg-green-700 transition">
                View Posts
            </button>
            <button onClick={handleLogout} className="bg-red-500 text-white mt-4 px-4 py-2 rounded">
                Logout
            </button>
        </div>
    );
}
