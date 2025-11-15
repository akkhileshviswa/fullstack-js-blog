"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../utils/api";

export default function AuthCallback() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/auth/profile");
                setAuth(res.data, null);
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
