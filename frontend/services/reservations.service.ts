import apiClient from "@/lib/api";
import { Reservation, CreateReservationDto } from "@/types";

export const reservationsService = {
    async createReservation(data: CreateReservationDto): Promise<Reservation> {
        const response = await apiClient.post<Reservation>("/reservations", data);
        return response.data;
    },

    async getMyReservations(): Promise<Reservation[]> {
        const response = await apiClient.get<Reservation[]>("/reservations/me");
        return response.data;
    },

    async getAllReservations(): Promise<Reservation[]> {
        const response = await apiClient.get<Reservation[]>("/reservations");
        return response.data;
    },

    async pickupVehicle(id: string): Promise<Reservation> {
        const response = await apiClient.post<Reservation>(`/reservations/${id}/pickup`);
        return response.data;
    },

    async returnVehicle(id: string): Promise<Reservation> {
        const response = await apiClient.post<Reservation>(`/reservations/${id}/return`);
        return response.data;
    },

    async cancelReservation(id: string): Promise<Reservation> {
        const response = await apiClient.delete<Reservation>(`/reservations/${id}`);
        return response.data;
    },
};
