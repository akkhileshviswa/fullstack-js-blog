"use client";
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import PostForm from "../../components/PostForm";

/**
 * CreatePostPage component - Renders a page for creating a new blog post.
 * Provides a form to submit new post data.
 *
 * @returns {JSX.Element} The create post page component with PostForm
 */
export default function CreatePostPage() {
    const router = useRouter();

    /**
     * Handles the submission of new post data.
     * Sends a POST request to create the post and redirects to posts list on success.
     *
     * @async
     * @function handleSubmit
     * @param {Object} data - The post data to be sent to the API
     * @param {string} [data.title] - The post title
     * @param {string} [data.content] - The post content
     * @returns {Promise<void>} Resolves when post is created and navigation occurs
     *
     * @throws {Error} If API request fails - logs error to console
     * @throws {Error} If user is unauthorized (401) - redirects to /signin
     * @throws {Error} If validation fails or post creation is rejected by server
     */
    const handleSubmit = async (data) => {
        try {
            const token = localStorage.getItem("token");
            await api.post("/posts/create", data, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            router.push("/posts");
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                router.push("/signin");
            }
        }
    };

    return <PostForm onSubmit={handleSubmit} />;
}
