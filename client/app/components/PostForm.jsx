"use client";
import { useState, useEffect } from "react";

export default function PostForm({ initialData, onSubmit, isEditing }) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title ?? "");
            setContent(initialData.content ?? "");
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, content });
    };

    return (
        <form onSubmit={handleSubmit}
            className="bg-white shadow rounded-lg p-6 mb-8 max-w-2xl mx-auto" >
            <h2 className="text-xl font-semibold mb-4">
                {isEditing ? "Edit Post" : "Create Post"}
            </h2>

            <input type="text" placeholder="Title"
                className="w-full border rounded p-2 mb-3"
                value={title} onChange={(e) => setTitle(e.target.value)} />

            <textarea placeholder="Content"
                className="w-full border rounded p-2 mb-3 h-28"
                value={content} onChange={(e) => setContent(e.target.value)} />

            <button type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                {isEditing ? "Update Post" : "Create Post"}
            </button>
        </form>
    );
}
