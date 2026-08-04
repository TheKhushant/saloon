
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
const isAdmin = (user: any) => user && (user.role === "admin" || user.role === "branch_admin");


export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground font-body">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-2xl font-semibold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground font-body">You need admin privileges to access this panel.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
