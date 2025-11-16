"use client";

import { useRouter } from "next/navigation";

/**
 * HomePage component - Renders the main landing page with authentication options.
 * Provides buttons for sign up, sign in, and Google OAuth login.
 *
 * @returns {JSX.Element} The home page component with navigation buttons
 */
export default function HomePage() {
    const router = useRouter();

    /**
     * Handles Google OAuth login by redirecting to the backend Google authentication endpoint.
     * Redirects the entire window to the Google OAuth URL.
     *
     * @function handleGoogleLogin
     * @returns {void}
     *
     * @throws {Error} If NEXT_PUBLIC_BACKEND_URL environment variable is not set
     * @throws {Error} If the redirect URL is invalid or unreachable
     */
    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">Welcome to My Blog App</h1>

            <div className="flex flex-col gap-3 w-64">
                <button onClick={() => router.push("/signup")}
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    Sign Up
                </button>

                <button onClick={() => router.push("/signin")}
                    className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                    Sign In
                </button>

                <button onClick={handleGoogleLogin}
                    className="bg-red-500 text-white py-2 rounded hover:bg-red-600 transition">
                    Continue with Google
                </button>
            </div>
        </div>
    );
}
