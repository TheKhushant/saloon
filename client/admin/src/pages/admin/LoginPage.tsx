// pages/admin/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();        // ← Yeh use kar rahe hain

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Signup mode ko temporarily hata rahe hain kyuki aap local chahte ho
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    // Use local auth
    const success = login(email, password);

    if (success) {
      toast.success("Login successful! Welcome Admin");
      navigate("/admin", { replace: true });
    } else {
      toast.error("Invalid credentials! Use correct email and password");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-heading font-bold text-lg">SG</span>
          </div>
          <CardTitle className="font-heading text-2xl">Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in to access the admin dashboard
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            Default Credentials:<br />
            <strong>Email:</strong> admin@gmail.com<br />
            <strong>Password:</strong> admin123
          </div>
        </CardContent>
      </Card>
    </div>
  );
}