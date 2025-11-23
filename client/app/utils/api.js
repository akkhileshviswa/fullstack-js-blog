import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

/**
 * Response interceptor for successful API responses.
 * Displays success toast notifications if a message is present in the response.
 *
 * @param {Object} response - The axios response object
 * @param {Object} [response.data] - The response data
 * @param {string} [response.data.message] - Optional success message to display
 * @returns {Object} The original response object
 */
api.interceptors.response.use(
    (response) => {
        if (response.data?.message) {
            toast.success(response.data.message);
        }
        return response;
    },
    /**
     * Response interceptor for API error responses.
     * Displays error toast notifications with the error message.
     *
     * @param {Error} error - The axios error object
     * @param {Object} [error.response] - The error response object
     * @param {Object} [error.response.data] - The error response data
     * @param {string} [error.response.data.message] - Optional error message from the server
     * @returns {Promise<never>} Rejects the promise with the error
     *
     * @throws {Error} Always rejects the promise with the error
     */
    (error) => {
        const msg = error.response?.data?.message || "Something went wrong!";
        toast.error(msg);
        return Promise.reject(error);
    }
);

export default api;
