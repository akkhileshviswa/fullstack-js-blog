"use client";
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import PostForm from "../../components/PostForm";

export default function CreatePostPage() {
    const router = useRouter();

    const handleSubmit = async (data) => {
        try {
            const token = localStorage.getItem("token");
            await api.post("/posts/create", data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            router.push("/posts");
        } catch (err) {
            console.error(err);
        }
    };

    return <PostForm onSubmit={handleSubmit} />;
}
