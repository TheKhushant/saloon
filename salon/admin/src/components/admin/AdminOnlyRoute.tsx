import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export function AdminOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
