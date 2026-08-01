import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if(token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use((response) => response, (error) => {
    // Skip the login request itself — a 401 there just means bad credentials,
    // and LoginForm needs to render that message instead of being redirected
    // (redirecting to /login from /login is a full reload that wipes it).
    const isLoginRequest = error.config?.url?.includes("/login");

    if (error.response && error.response.status === 401 && !isLoginRequest) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }
    return Promise.reject(error);
});

export default api;