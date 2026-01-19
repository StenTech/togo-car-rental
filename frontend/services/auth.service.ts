import apiClient from "@/lib/api";
import { LoginRequest, LoginResponse, RegisterRequest, User } from "@/types";

export const authService = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
        return response.data;
    },

    async register(data: RegisterRequest): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>("/auth/register", data);
        return response.data;
    },

    async getProfile(): Promise<User> {
        const response = await apiClient.get<User>("/auth/profile");
        return response.data;
    },

    async logout(): Promise<void> {
        await apiClient.post("/auth/logout");
    },
};
