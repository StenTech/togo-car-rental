"use client";

import { ReservationStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: ReservationStatus;
}

const statusConfig = {
  [ReservationStatus.PENDING]: {
    label: "En attente",
    variant: "warning" as const,
  },
  [ReservationStatus.CONFIRMED]: {
    label: "Confirmée",
    variant: "info" as const,
  },
  [ReservationStatus.IN_PROGRESS]: {
    label: "En cours",
    variant: "success" as const,
  },
  [ReservationStatus.COMPLETED]: {
    label: "Terminée",
    variant: "secondary" as const,
  },
  [ReservationStatus.CANCELLED]: {
    label: "Annulée",
    variant: "destructive" as const,
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
