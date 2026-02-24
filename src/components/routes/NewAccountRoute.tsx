import { useAuth } from "@/context/auth.context";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

export function NewAccountRoute({ children }: { children: ReactNode }) {
  const { hasBusiness } = useAuth();
  if (hasBusiness) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}
