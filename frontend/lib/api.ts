import axios from "axios";

const apiClient = axios.create({
    baseURL: typeof window !== "undefined" && window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:3000/api"
        : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"),
    withCredentials: true, // Important: pour envoyer les cookies httpOnly
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercepteur de réponse pour gérer les erreurs 401 (déconnexion automatique)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("[API Interceptor] Error caught:", {
            status: error.response?.status,
            url: error.config?.url,
            data: error.response?.data,
        });
        
        if (error.response?.status === 401) {
            // Redirection vers login si non authentifié
            // Mais on évite de rediriger si on est déjà sur la page de login
            if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
                console.error("[API] 401 Unauthorized - Redirection vers login", error.config?.url);
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
