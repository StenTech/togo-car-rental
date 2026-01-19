// Enums
export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
}

export enum ReservationStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export enum VehicleStatus {
    AVAILABLE = "AVAILABLE",
    RENTED = "RENTED",
    MAINTENANCE = "MAINTENANCE",
}

export enum VehicleCategory {
    SEDAN = "SEDAN",
    SUV = "SUV",
    VAN = "VAN",
    PICKUP = "PICKUP",
    MOTORCYCLE = "MOTORCYCLE",
    TRUCK = "TRUCK",
    BUS = "BUS",
    OTHER = "OTHER",
}

// Entities
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    year: number;
    plate: string;
    category: VehicleCategory;
    status: VehicleStatus;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Reservation {
    id: string;
    userId: string;
    vehicleId: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: ReservationStatus;
    user?: User;
    vehicle?: Vehicle;
    createdAt: string;
    updatedAt: string;
    cancelledAt?: string;
}

// DTOs
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    access_token: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface CreateVehicleDto {
    brand: string;
    model: string;
    year: number;
    plate: string;
    category: VehicleCategory;
    status?: VehicleStatus;
    imageUrl?: string;
}

export interface UpdateVehicleDto extends Partial<CreateVehicleDto> { }

export interface CreateReservationDto {
    vehicleId: string;
    startDate: string;
    endDate: string;
    reason: string;
}
