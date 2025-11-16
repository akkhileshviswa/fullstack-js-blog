"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../utils/api";
import PostCard from "../components/PostCard";
import ConfirmModal from "../components/ConfirmModal";

const POSTS_PER_PAGE = 3;

export default function AllPostsPage() {
    const [posts, setPosts] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchPosts = async (pageNum = 1, query = "") => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const res = await api.get("/posts/all", {
                params: { page: pageNum, limit: POSTS_PER_PAGE, search: query },
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            setPosts(res.data.posts);
            setTotalPages(res.data.totalPages || 1);
            setPage(pageNum);
        } catch (err) {
            console.error("Error fetching posts:", err);
            if (err.response?.status === 401) {
                router.push("/signin");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPosts(1, search);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/posts/${deleteId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            setPosts(posts.filter((p) => p.id !== deleteId));
            setDeleteId(null);
            fetchPosts();
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                router.push("/signin");
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <div className="flex justify-between mb-6 items-center">
                <h1 className="text-3xl font-bold">All Posts</h1>
                <button onClick={() => router.push("/posts/create")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" >
                    + New Post
                </button>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input type="text" placeholder="Search posts..."
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    className="border rounded px-3 py-2 flex-grow" />
                <button type="submit"
                    className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700" >
                    Search
                </button>
            </form>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : posts.length === 0 ? (
                <p className="text-center text-gray-500">No posts found.</p>
            ) : (
                posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onEdit={(id) => router.push(`/posts/edit/${id}`)}
                        onDelete={(id) => setDeleteId(id)}
                    />
                ))
            )}

            {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-3">
                    <button disabled={page <= 1}
                        onClick={() => fetchPosts(page - 1, search)}
                        className={`px-4 py-2 rounded ${page <= 1
                                ? "bg-gray-300"
                                : "bg-gray-800 text-white hover:bg-gray-700"
                            }`}
                    >
                        Previous
                    </button>

                    <span className="text-gray-700 self-center">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        disabled={page >= totalPages}
                        onClick={() => fetchPosts(page + 1, search)}
                        className={`px-4 py-2 rounded ${page >= totalPages
                                ? "bg-gray-300"
                                : "bg-gray-800 text-white hover:bg-gray-700"
                            }`}
                    >
                        Next
                    </button>
                </div>
            )}

            <ConfirmModal
                isOpen={!!deleteId}
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}
