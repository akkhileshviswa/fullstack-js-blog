"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import api from "../utils/api";

export default function ProfilePage() {
    const router = useRouter();
    const { logout } = useAuthStore();
    const [profile, setProfile] = useState(null);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const localToken = localStorage.getItem("token");

                const res = await api.get("/auth/profile", {
                    headers: localToken ? { Authorization: `Bearer ${localToken}` } : {},
                });
                setProfile(res.data);
            } catch (err) {
                console.error(err);
                handleLogout();
                router.push("/signin");
            }
        };

        fetchProfile();
    }, [router]);

    if (!profile) return <p>Loading...</p>;

    return (
        <div className="max-w-md mx-auto mt-10 text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome, {profile.name}</h1>
            <button onClick={() => router.push("/posts")}
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                View Posts
            </button>
            <button onClick={handleLogout} className="bg-red-500 text-white mt-4 px-4 py-2 rounded">
                Logout
            </button>
        </div>
    );
}
