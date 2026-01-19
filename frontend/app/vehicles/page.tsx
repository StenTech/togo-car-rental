"use client";

import { useQuery } from "@tanstack/react-query";
import { vehiclesService } from "@/services/vehicles.service";
import { VehicleCard } from "@/components/features/vehicle-card";
import { Car } from "lucide-react";

export default function VehiclesPage() {
  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ["vehicles"],
    queryFn: vehiclesService.getVehicles,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-muted-foreground">Chargement des véhicules...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <p className="text-destructive">Erreur lors du chargement des véhicules</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Car className="h-8 w-8" />
          Flotte de véhicules
        </h1>
        <p className="text-muted-foreground">
          Véhicules disponibles pour réservation
        </p>
      </div>

      {vehicles && vehicles.length === 0 ? (
        <div className="text-center py-12">
          <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucun véhicule disponible pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles?.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
