"use client";

import { useQuery } from "@tanstack/react-query";
import { reservationsService } from "@/services/reservations.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/features/status-badge";
import { formatDateTime } from "@/lib/utils";
import { Calendar, Car } from "lucide-react";

export default function MyReservationsPage() {
  const { data: reservations, isLoading } = useQuery({
    queryKey: ["my-reservations"],
    queryFn: reservationsService.getMyReservations,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Calendar className="h-8 w-8" />
          Mes réservations
        </h1>
        <p className="text-muted-foreground">
          Historique de vos réservations de véhicules
        </p>
      </div>

      {reservations && reservations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas encore de réservation
            </p>
            <a href="/vehicles" className="text-primary hover:underline">
              Parcourir le catalogue
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations?.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {reservation.vehicle?.brand} {reservation.vehicle?.model}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Réservation #{reservation.id}
                    </p>
                  </div>
                  <StatusBadge status={reservation.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Date de début
                    </p>
                    <p className="font-semibold">{formatDateTime(reservation.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Date de fin
                    </p>
                    <p className="font-semibold">{formatDateTime(reservation.endDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
