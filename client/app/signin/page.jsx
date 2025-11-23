"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import api from "../utils/api";
import AuthForm from "../components/AuthForm";

/**
 * SigninPage component - Renders the user login page.
 * Redirects to profile if user is already authenticated.
 *
 * @returns {JSX.Element} The signin page component with AuthForm
 */
export default function SigninPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        if (token) {
            router.replace("/profile");
        }
    }, [token]);

    /**
     * Handles the signin form submission.
     * Sends user credentials to the API and updates auth state on success.
     *
     * @async
     * @function handleSignin
     * @param {Object} values - The form values containing user credentials
     * @param {string} values.username - The user's username
     * @param {string} values.password - The user's password
     * @param {Object} formikHelpers - Formik helper functions
     * @param {Function} formikHelpers.setSubmitting - Function to set the submitting state
     * @returns {Promise<void>} Resolves when signin is complete
     *
     * @throws {Error} If API request fails - logs error to console
     * @throws {Error} If credentials are invalid or user not found
     */
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
