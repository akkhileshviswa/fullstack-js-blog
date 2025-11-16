"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import api from "../utils/api";
import AuthForm from "../components/AuthForm";

export default function SigninPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        if (token) {
            router.replace("/profile");
        }
    }, [token]);

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
