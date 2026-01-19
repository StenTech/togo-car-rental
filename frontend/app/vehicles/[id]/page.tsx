"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { vehiclesService } from "@/services/vehicles.service";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Calendar, Settings } from "lucide-react";
import { VehicleStatus, UserRole } from "@/types";
import { ReservationDialog } from "@/components/features/reservation-dialog";
import { useState } from "react";

const statusConfig = {
  [VehicleStatus.AVAILABLE]: {
    label: "Disponible",
    variant: "success" as const,
  },
  [VehicleStatus.RENTED]: {
    label: "Loué",
    variant: "destructive" as const,
  },
  [VehicleStatus.MAINTENANCE]: {
    label: "Maintenance",
    variant: "warning" as const,
  },
};

export default function VehicleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [showReservationDialog, setShowReservationDialog] = useState(false);

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => vehiclesService.getVehicle(id),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <p className="text-destructive">Véhicule non trouvé</p>
          <Button className="mt-4" onClick={() => router.push("/vehicles")}>
            Retour au catalogue
          </Button>
        </div>
      </div>
    );
  }

  const status = statusConfig[vehicle.status];

  const handleReservation = () => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (vehicle.status === VehicleStatus.AVAILABLE) {
      setShowReservationDialog(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden">
            {vehicle.imageUrl ? (
              <Image
                src={vehicle.imageUrl}
                alt={`${vehicle.brand} ${vehicle.model}`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Car className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {vehicle.brand} {vehicle.model}
          </h1>
          <p className="text-muted-foreground mb-6">Année {vehicle.year}</p>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Caractéristiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Catégorie</span>
                <span className="font-medium">{vehicle.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Immatriculation</span>
                <span className="font-medium">{vehicle.plate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Statut</span>
                <Badge variant={status.variant} className="ml-2">
                  {status.label}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {user?.role !== UserRole.ADMIN && (
            <Button
              className="w-full"
              size="lg"
              onClick={handleReservation}
              disabled={vehicle.status !== VehicleStatus.AVAILABLE}
            >
              <Calendar className="mr-2 h-5 w-5" />
              {vehicle.status === VehicleStatus.AVAILABLE
                ? "Réserver maintenant"
                : "Non disponible"}
            </Button>
          )}

          {user?.role === UserRole.ADMIN && (
            <div className="rounded-lg bg-yellow-100 p-4 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
              <p className="text-sm font-medium">
                Mode Administrateur : Pour gérer ce véhicule, passez par le backoffice.
              </p>
            </div>
          )}
        </div>
      </div>

      {showReservationDialog && (
        <ReservationDialog
          vehicle={vehicle}
          open={showReservationDialog}
          onOpenChange={setShowReservationDialog}
        />
      )}
    </div>
  );
}
