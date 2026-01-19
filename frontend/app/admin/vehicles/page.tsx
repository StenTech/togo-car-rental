"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehiclesService } from "@/services/vehicles.service";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AuthGuard } from "@/components/shared/auth-guard";
import { UserRole, VehicleStatus } from "@/types";
import { Car, Edit, Plus, Trash2 } from "lucide-react";
import { VehicleFormDialog } from "@/components/features/vehicle-form-dialog";
import { toast } from "sonner";

const statusConfig = {
  [VehicleStatus.AVAILABLE]: { label: "Disponible", variant: "success" as const },
  [VehicleStatus.RENTED]: { label: "Loué", variant: "destructive" as const },
  [VehicleStatus.MAINTENANCE]: { label: "Maintenance", variant: "warning" as const },
};

export default function AdminVehiclesPage() {
  const queryClient = useQueryClient();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: vehiclesService.getVehicles,
  });

  const deleteMutation = useMutation({
    mutationFn: vehiclesService.deleteVehicle,
    onSuccess: () => {
      toast.success("Véhicule supprimé");
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const handleEdit = (id: string) => {
    setSelectedVehicle(id);
    setShowDialog(true);
  };

  const handleAdd = () => {
    setSelectedVehicle(null);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    setVehicleToDelete(id);
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      deleteMutation.mutate(vehicleToDelete);
      setVehicleToDelete(null);
    }
  };

  return (
    <AuthGuard requiredRole={UserRole.ADMIN}>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Car className="h-6 w-6" />
                Gestion des véhicules
              </CardTitle>
              <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un véhicule
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Année</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles?.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">
                        {vehicle.brand} {vehicle.model}
                      </TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>{vehicle.category}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[vehicle.status].variant}>
                          {statusConfig[vehicle.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(vehicle.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(vehicle.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <VehicleFormDialog
          vehicleId={selectedVehicle}
          open={showDialog}
          onOpenChange={setShowDialog}
        />

        <Dialog open={!!vehicleToDelete} onOpenChange={(open) => !open && setVehicleToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setVehicleToDelete(null)}
                disabled={deleteMutation.isPending}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  );
}
