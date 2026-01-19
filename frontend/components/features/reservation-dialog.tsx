"use client";

import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { reservationsService } from "@/services/reservations.service";
import { Vehicle } from "@/types";
import { toast } from "sonner";

const reservationSchema = z.object({
  startDate: z.string().min(1, "Date et heure de début requises"),
  endDate: z.string().min(1, "Date et heure de fin requises"),
  reason: z.string().min(5, "Le motif doit contenir au moins 5 caractères"),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
  message: "La date de fin doit être après la date de début",
  path: ["endDate"],
});

type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationDialogProps {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReservationDialog({
  vehicle,
  open,
  onOpenChange,
}: ReservationDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
  });

  const createMutation = useMutation({
    mutationFn: reservationsService.createReservation,
    onSuccess: () => {
      toast.success("Réservation créée avec succès !");
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      onOpenChange(false);
      router.push("/reservations");
    },
    onError: (error: any) => {
      console.error("[Reservation] Full error:", error);
      console.error("[Reservation] Error response:", error.response?.data);
      
      // Extraction du message d'erreur du backend
      let errorMessage = "Erreur lors de la réservation";
      
      if (error.response?.data) {
        const data = error.response.data;
        // S'assurer qu'on récupère bien une string
        if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (typeof data.error === 'string') {
          errorMessage = data.error;
        }
      }
      
      toast.error(errorMessage, {
        duration: 6000,
        closeButton: true,
      });
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const onSubmit = async (data: ReservationFormData) => {
    // Ensure dates are parsed correctly
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    
    try {
      await createMutation.mutateAsync({
        vehicleId: vehicle.id,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        reason: data.reason,
      });
    } catch (error) {
      // L'erreur est déjà gérée dans onError de la mutation
      console.error("Submission error:", error);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Réserver {vehicle.brand} {vehicle.model}</DialogTitle>
          <DialogDescription>
            Sélectionnez vos dates et heures de location
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date et heure de début</Label>
              <Input
                id="startDate"
                type="datetime-local"
                min={getMinDateTime()}
                {...register("startDate")}
                disabled={createMutation.isPending}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date et heure de fin</Label>
              <Input
                id="endDate"
                type="datetime-local"
                min={startDate || getMinDateTime()}
                {...register("endDate")}
                disabled={createMutation.isPending}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">{errors.endDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Motif du déplacement</Label>
              <Input
                id="reason"
                placeholder="Ex: Mission à Kara, Rdv Client..."
                {...register("reason")}
                disabled={createMutation.isPending}
              />
              {errors.reason && (
                <p className="text-sm text-destructive">{errors.reason.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Création..." : "Confirmer la réservation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
