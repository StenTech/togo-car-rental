"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Car, LogOut, LayoutDashboard, User } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success("Déconnexion réussie");
      router.push("/");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/vehicles" className="flex items-center gap-2 text-xl font-bold">
            <Car className="h-6 w-6" />
            <span>Gestion de Flotte</span>
          </Link>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/vehicles"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/vehicles"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Véhicules
                </Link>

                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                    pathname.startsWith("/dashboard")
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin/vehicles"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname.startsWith("/admin")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    Connexion
                  </Button>
                </Link>
                {/* Suppression du bouton Inscription public pour appli interne */}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
