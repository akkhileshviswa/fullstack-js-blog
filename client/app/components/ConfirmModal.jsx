"use client";

export default function ConfirmModal({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
                <div className="flex gap-3">
                    <button onClick={onConfirm}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" >
                        Yes
                    </button>
                    <button onClick={onCancel}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}
