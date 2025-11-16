"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../utils/api";
import PostForm from "../../../components/PostForm";

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await api.get(`/posts/${params.id}`, {
                headers: { Authorization: `Bearer ${token}` }});
                setPost(res.data.posts);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    router.push("/signin");
                }
            }
        };
        fetchPost();
    }, [params.id]);

    const handleUpdate = async (data) => {
        try {
            const token = localStorage.getItem("token");
            await api.put(`/posts/${params.id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            router.push("/posts");
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                router.push("/signin");
            }
        }
    };

    if (!post) return <p>Loading...</p>;

    return <PostForm initialData={post} onSubmit={handleUpdate} isEditing />;
}
