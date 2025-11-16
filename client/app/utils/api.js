import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        if (response.data?.message) {
            toast.success(response.data.message);
        }
        return response;
    },
    (error) => {
        const msg = error.response?.data?.message || "Something went wrong!";
        toast.error(msg);
        return Promise.reject(error);
    }
);

export default api;
