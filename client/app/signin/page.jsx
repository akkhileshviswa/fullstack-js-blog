"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import api from "../utils/api";
import AuthForm from "../components/AuthForm";

export default function SigninPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const { token, hasHydrated } = useAuthStore();

    useEffect(() => {
        if (!hasHydrated) return;

        if (token) {
            router.replace("/profile");
        }
    }, [token, hasHydrated]);

    const handleSignin = async (values, { setSubmitting }) => {
        try {
            const res = await api.post("/auth/signin", values);
            setAuth(res.data.user, res.data.token);
            router.push("/profile");
        } catch (err) {
            console.error(err.response?.data || err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return <AuthForm type="signin" onSubmit={handleSignin} />;
}
