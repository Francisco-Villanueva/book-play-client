import { useAuth } from "@/context/auth.context";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

export function RequiresBusinessRoute({ children }: { children: ReactNode }) {
  const { hasBusiness } = useAuth();
  if (!hasBusiness) return <Navigate to="/new-account" replace />;
  return <>{children}</>;
}
