"use client";

import { AuthGuard } from "@/components/shared/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">{children}</div>
    </AuthGuard>
  );
}
