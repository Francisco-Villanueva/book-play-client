import { useAuth } from "@/context/auth.context";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoadingUser } = useAuth();
  if (isLoadingUser) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
