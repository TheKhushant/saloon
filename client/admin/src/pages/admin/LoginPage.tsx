import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [signUpMode, setSignUpMode] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      setLoading(false);

      if (data.token) {

        localStorage.setItem("adminToken", data.token);

        toast.success("Login successful");

        navigate("/admin");

      } else {

        toast.error("Invalid login credentials");

      }

    } catch (error) {

      setLoading(false);
      toast.error("Server error");

    }
  };

  // const handleSignUp = async () => {
  //   if (!email.trim() || !password.trim()) {
  //     toast.error("Please enter email and password");
  //     return;
  //   }
  //   if (signUpMode && !name.trim()) {
  //     toast.error("Please enter your name");
  //     return;
  //   }
  //   if (password.length < 6) {
  //     toast.error("Password must be at least 6 characters");
  //     return;
  //   }
  //   setSignUpLoading(true);
  //   const { error } = await signUp(email, password, name.trim());
  //   if (error) {
  //     toast.error(error);
  //     setSignUpLoading(false);
  //     return;
  //   }
  //   // Auto-assign admin role
  //   const { data: { user } } = await supabase.auth.getUser();
  //   if (user) {
  //     await supabase.from("user_roles").insert([{ user_id: user.id, role: "admin" }]);
  //   }
  //   toast.success("Admin account created! Signing in...");
  //   await signIn(email, password);
  //   setSignUpLoading(false);
  //   navigate("/admin");
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-heading font-bold text-lg">SG</span>
          </div>
          <CardTitle className="font-heading text-2xl">
            {signUpMode ? "Create Admin Account" : "Admin Login"}
          </CardTitle>
          <p className="text-sm text-muted-foreground font-body">
            {signUpMode ? "Set up your admin credentials" : "Sign in to access the admin dashboard"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {signUpMode && (
              <div className="space-y-2">
                <Label htmlFor="name" className="font-body">Full Name</Label>
                <Input id="name" type="text" placeholder="e.g. Sarah Ahmed" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body">Email</Label>
              <Input id="email" type="email" placeholder="admin@salonglow.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-body">Password</Label>
                {!signUpMode && (
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline font-body">
                    Forgot Password?
                  </Link>
                )}
              </div>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {!signUpMode && (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            )}
          </form>

          {signUpMode && (
            <div className="mt-4">
              <Button className="w-full" disabled={signUpLoading} onClick={handleSignUp}>
                {signUpLoading ? "Creating account..." : "Create Account & Sign In"}
              </Button>
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              className="text-sm text-muted-foreground font-body hover:text-primary underline"
              onClick={() => setSignUpMode(!signUpMode)}
            >
              {signUpMode ? "Already have an account? Sign in" : "First time? Create admin account"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
