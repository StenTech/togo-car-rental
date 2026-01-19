import { create } from "zustand";
import { User } from "@/types";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

// Note: Avec httpOnly cookies, on ne stocke plus le token côté client
// L'authentification est gérée automatiquement via les cookies
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) =>
        set({
            user,
            isAuthenticated: !!user,
        }),
    logout: () =>
        set({
            user: null,
            isAuthenticated: false,
        }),
}));
