"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/auth/google";
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
