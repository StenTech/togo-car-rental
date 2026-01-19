"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationsService } from "@/services/reservations.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuthGuard } from "@/components/shared/auth-guard";
import { UserRole, ReservationStatus } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { CheckCircle, PlayCircle, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/features/status-badge";
import { toast } from "sonner";

export default function AdminInteractionsPage() {
  const queryClient = useQueryClient();

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: reservationsService.getAllReservations,
  });

  const pickupMutation = useMutation({
    mutationFn: reservationsService.pickupVehicle,
    onSuccess: () => {
      toast.success("Départ enregistré");
      queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement");
    },
  });

  const returnMutation = useMutation({
    mutationFn: reservationsService.returnVehicle,
    onSuccess: () => {
      toast.success("Retour enregistré");
      queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement");
    },
  });

  const handlePickup = (id: string) => {
    if (confirm("Confirmer le départ du véhicule ?")) {
      pickupMutation.mutate(id);
    }
  };

  const handleReturn = (id: string) => {
    if (confirm("Confirmer le retour du véhicule ?")) {
      returnMutation.mutate(id);
    }
  };

  // Filter active reservations (CONFIRMED or IN_PROGRESS)
  const activeReservations = reservations?.filter(
    (r) => r.status === ReservationStatus.CONFIRMED || r.status === ReservationStatus.IN_PROGRESS
  );

  return (
    <AuthGuard requiredRole={UserRole.ADMIN}>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Gestion de la flotte - Check-in / Check-out
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              </div>
            ) : activeReservations && activeReservations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucune réservation active
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Début</TableHead>
                    <TableHead>Fin</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeReservations?.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">
                        {reservation.user?.firstName} {reservation.user?.lastName}
                        <div className="text-sm text-muted-foreground">
                          {reservation.user?.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {reservation.vehicle?.brand} {reservation.vehicle?.model}
                      </TableCell>
                      <TableCell>{formatDateTime(reservation.startDate)}</TableCell>
                      <TableCell>{formatDateTime(reservation.endDate)}</TableCell>
                      <TableCell>
                        <StatusBadge status={reservation.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {reservation.status === ReservationStatus.CONFIRMED && (
                            <Button
                              size="sm"
                              onClick={() => handlePickup(reservation.id)}
                              disabled={pickupMutation.isPending}
                            >
                              <PlayCircle className="mr-2 h-4 w-4" />
                              Départ
                            </Button>
                          )}
                          {reservation.status === ReservationStatus.IN_PROGRESS && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleReturn(reservation.id)}
                              disabled={returnMutation.isPending}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Retour
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
