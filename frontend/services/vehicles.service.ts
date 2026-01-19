import apiClient from "@/lib/api";
import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from "@/types";

export const vehiclesService = {
    async getVehicles(): Promise<Vehicle[]> {
        const response = await apiClient.get<Vehicle[]>("/vehicles");
        return response.data;
    },

    async getVehicle(id: string): Promise<Vehicle> {
        const response = await apiClient.get<Vehicle>(`/vehicles/${id}`);
        return response.data;
    },

    async createVehicle(data: CreateVehicleDto): Promise<Vehicle> {
        const response = await apiClient.post<Vehicle>("/vehicles", data);
        return response.data;
    },

    async updateVehicle(id: string, data: UpdateVehicleDto): Promise<Vehicle> {
        const response = await apiClient.patch<Vehicle>(`/vehicles/${id}`, data);
        return response.data;
    },

    async deleteVehicle(id: string): Promise<void> {
        await apiClient.delete(`/vehicles/${id}`);
    },

    async uploadVehicleImage(id: string, file: File): Promise<Vehicle> {
        const formData = new FormData();
        formData.append("file", file); // Must match backend @UseInterceptors(FileInterceptor('file'))
        const response = await apiClient.post<Vehicle>(`/vehicles/${id}/image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};
