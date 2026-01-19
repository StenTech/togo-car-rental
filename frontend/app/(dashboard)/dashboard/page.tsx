"use client";

import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { reservationsService } from "@/services/reservations.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Car, User } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: reservations } = useQuery({
    queryKey: ["my-reservations"],
    queryFn: reservationsService.getMyReservations,
  });

  const activeReservations = reservations?.filter(
    (r) => r.status === "CONFIRMED" || r.status === "IN_PROGRESS"
  ).length || 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue, {user?.firstName} !
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Réservations actives
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReservations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total réservations
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservations?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Profil
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{user?.email}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <a
              href="/vehicles"
              className="block p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold">Rechercher un véhicule</h3>
              <p className="text-sm text-muted-foreground">
                Parcourez notre catalogue de véhicules disponibles
              </p>
            </a>
            <a
              href="/reservations"
              className="block p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold">Mes réservations</h3>
              <p className="text-sm text-muted-foreground">
                Consultez l'historique de vos locations
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
