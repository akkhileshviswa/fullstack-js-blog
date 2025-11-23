"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import api from "../utils/api";
import AuthForm from "../components/AuthForm";

/**
 * SignupPage component - Renders the user registration page.
 * Redirects to profile if user is already authenticated.
 *
 * @returns {JSX.Element} The signup page component with AuthForm
 */
export default function SignupPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        if (token) {
            router.replace("/profile");
        }
    }, [token]);

    /**
     * Handles the signup form submission.
     * Sends user registration data to the API and updates auth state on success.
     *
     * @async
     * @function handleSignup
     * @param {Object} values - The form values containing user registration data
     * @param {string} values.name - The user's full name
     * @param {string} values.username - The user's username
     * @param {string} values.password - The user's password
     * @param {Object} formikHelpers - Formik helper functions
     * @param {Function} formikHelpers.setSubmitting - Function to set the submitting state
     * @returns {Promise<void>} Resolves when signup is complete
     *
     * @throws {Error} If API request fails - logs error to console
     * @throws {Error} If validation fails or username already exists
     */
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
