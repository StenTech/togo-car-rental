"use client";

import Image from "next/image";
import Link from "next/link";
import { Car } from "lucide-react";
import { Vehicle, VehicleStatus } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VehicleCardProps {
  vehicle: Vehicle;
}

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

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const status = statusConfig[vehicle.status];

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full bg-muted">
          {vehicle.imageUrl ? (
            <Image
              src={vehicle.imageUrl}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Car className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="text-sm text-muted-foreground">
          {vehicle.year} • {vehicle.category}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Immatriculation: {vehicle.plate}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/vehicles/${vehicle.id}`} className="w-full">
          <Button className="w-full" variant="outline">
            Voir détails
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
