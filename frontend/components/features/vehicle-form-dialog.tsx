"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { vehiclesService } from "@/services/vehicles.service";
import { VehicleCategory, VehicleStatus } from "@/types";
import { toast } from "sonner";
import { Upload } from "lucide-react";

const vehicleSchema = z.object({
  brand: z.string().min(1, "Marque requise"),
  model: z.string().min(1, "Modèle requis"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  plate: z.string().min(1, "Plaque requise"),
  category: z.nativeEnum(VehicleCategory),
  status: z.nativeEnum(VehicleStatus),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormDialogProps {
  vehicleId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VehicleFormDialog({
  vehicleId,
  open,
  onOpenChange,
}: VehicleFormDialogProps) {
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: vehicle } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => vehiclesService.getVehicle(vehicleId!),
    enabled: !!vehicleId,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  useEffect(() => {
    if (vehicle) {
      setValue("brand", vehicle.brand);
      setValue("model", vehicle.model);
      setValue("year", vehicle.year);
      setValue("plate", vehicle.plate);
      setValue("category", vehicle.category);
      setValue("status", vehicle.status);
    } else {
      reset();
    }
  }, [vehicle, setValue, reset]);

  const createMutation = useMutation({
    mutationFn: vehiclesService.createVehicle,
    onSuccess: async (newVehicle) => {
      if (imageFile) {
        await vehiclesService.uploadVehicleImage(newVehicle.id, imageFile);
      }
      toast.success("Véhicule créé");
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      onOpenChange(false);
      reset();
      setImageFile(null);
    },
    onError: () => {
      toast.error("Erreur lors de la création");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VehicleFormData> }) =>
      vehiclesService.updateVehicle(id, data),
    onSuccess: async () => {
      if (imageFile && vehicleId) {
        await vehiclesService.uploadVehicleImage(vehicleId, imageFile);
      }
      toast.success("Véhicule mis à jour");
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] });
      onOpenChange(false);
      setImageFile(null);
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  const onSubmit = (data: VehicleFormData) => {
    if (vehicleId) {
      updateMutation.mutate({ id: vehicleId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {vehicleId ? "Modifier le véhicule" : "Ajouter un véhicule"}
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations du véhicule
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marque</Label>
              <Input id="brand" {...register("brand")} disabled={isLoading} />
              {errors.brand && (
                <p className="text-sm text-destructive">{errors.brand.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modèle</Label>
              <Input id="model" {...register("model")} disabled={isLoading} />
              {errors.model && (
                <p className="text-sm text-destructive">{errors.model.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Année</Label>
              <Input id="year" type="number" {...register("year")} disabled={isLoading} />
              {errors.year && (
                <p className="text-sm text-destructive">{errors.year.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="plate">Immatriculation</Label>
              <Input id="plate" {...register("plate")} disabled={isLoading} />
              {errors.plate && (
                <p className="text-sm text-destructive">{errors.plate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select onValueChange={(value) => setValue("category", value as VehicleCategory)} defaultValue={vehicle?.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(VehicleCategory).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select onValueChange={(value) => setValue("status", value as VehicleStatus)} defaultValue={vehicle?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(VehicleStatus).map((stat) => (
                    <SelectItem key={stat} value={stat}>
                      {stat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              {imageFile && (
                <p className="text-sm text-muted-foreground">{imageFile.name}</p>
              )}
              {/* Preview de l'image existante ou nouvelle */}
              {(imageFile || (vehicle?.imageUrl)) && (
                <div className="mt-2 relative h-40 w-full overflow-hidden rounded-md border">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : vehicle?.imageUrl}
                    alt="Aperçu véhicule"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : vehicleId ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
