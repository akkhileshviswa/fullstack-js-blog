"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../utils/api";
import PostForm from "../../../components/PostForm";

/**
 * EditPostPage component - Renders a page for editing an existing blog post.
 * Fetches the post data on mount and provides a form to update it.
 *
 * @returns {JSX.Element} The edit post page component with PostForm or loading state
 *
 * @throws {Error} Redirects to /signin if user is not authenticated (401)
 * @throws {Error} Logs error to console if post fetch fails
 */
export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        /**
         * Fetches a single post by ID from the API.
         * Retrieves the post data and updates the component state.
         *
         * @async
         * @function fetchPost
         * @returns {Promise<void>} Resolves when post is fetched and state is updated
         *
         * @throws {Error} If API request fails - logs error to console
         * @throws {Error} If user is unauthorized (401) - redirects to /signin
         * @throws {Error} If post ID is invalid or post not found
         */
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await api.get(`/posts/${params.id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {} }
                );
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

    /**
     * Handles the submission of updated post data.
     * Sends a PUT request to update the post and redirects to posts list on success.
     *
     * @async
     * @function handleUpdate
     * @param {Object} data - The updated post data to be sent to the API
     * @param {string} [data.title] - The post title
     * @param {string} [data.content] - The post content
     * @returns {Promise<void>} Resolves when post is updated and navigation occurs
     *
     * @throws {Error} If API request fails - logs error to console
     * @throws {Error} If user is unauthorized (401) - redirects to /signin
     * @throws {Error} If validation fails or post update is rejected by server
     */
    const handleUpdate = async (data) => {
        try {
            const token = localStorage.getItem("token");
            await api.put(`/posts/${params.id}`, data, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
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
