"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth.service";
import { UserRole } from "@/types";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, setUser } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Vérifier l'authentification via le cookie httpOnly
        const profile = await authService.getProfile();
        setUser(profile);

        // Vérifier le rôle si requis
        if (requiredRole && profile.role !== requiredRole) {
          router.push("/");
        }
      } catch (error) {
        // Si non authentifié, rediriger vers login
        router.push("/login");
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    } else if (requiredRole && user?.role !== requiredRole) {
      router.push("/");
    }
  }, [isAuthenticated, user, requiredRole, router, setUser]);

  // Afficher le contenu seulement si authentifié et autorisé
  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Vérification...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
