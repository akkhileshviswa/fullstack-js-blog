"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import api from "../utils/api";
import AuthForm from "../components/AuthForm";

export default function SignupPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSignup = async (values, { setSubmitting }) => {
        try {
            const res = await api.post("/auth/signup", values);
            setAuth(res.data.user, res.data.token);
            router.push("/profile");
        } catch (err) {
            console.error(err.response?.data || err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return <AuthForm type="signup" onSubmit={handleSignup} />;
}
