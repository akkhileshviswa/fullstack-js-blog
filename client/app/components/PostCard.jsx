"use client";

export default function PostCard({ post, onEdit, onDelete }) {
    return (
        <div className="border rounded-lg p-4 bg-white shadow mb-3 flex justify-between items-start">
            <div>
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <p className="text-gray-600 mt-1">{post.content}</p>
            </div>

            <div className="flex gap-2">
                <button onClick={() => onEdit(post.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600" >
                    Edit
                </button>
                <button onClick={() => onDelete(post.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" >
                    Delete
                </button>
            </div>
        </div>
    );
}
