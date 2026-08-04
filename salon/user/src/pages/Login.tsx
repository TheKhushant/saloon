import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Scissors, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needsSignup, setNeedsSignup] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = (location.state as { from?: string })?.from || "/dashboard";

  const handleSubmit = () => {
    setError("");
    setNeedsSignup(false);

    const result = login({ email: email.trim(), password });
    if (!result.success) {
      setError(result.error || "Unable to sign in.");
      if (result.error?.toLowerCase().includes("sign up")) {
        setNeedsSignup(true);
      }
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 gradient-gold rounded-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-2xl font-bold text-foreground">Glam Aura</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold mb-1">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            {location.state ? "Please sign in to continue booking your appointment" : "Sign in to your account"}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs text-red-600">
                  {error}
                  {needsSignup && (
                    <>
                      {" "}
                      <Link to="/signup" state={location.state} className="font-semibold underline">
                        Create one now
                      </Link>
                      .
                    </>
                  )}
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <button onClick={handleSubmit} className="btn-gold w-full block text-center">Sign In</button>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              state={location.state}
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
          {/* Demo Credentials Helper */}
          <div className="mt-6 rounded-lg bg-secondary/50 p-3 text-xs">
            <p className="font-medium text-muted-foreground mb-1">Demo Credentials:</p>
            <p>Email: <code className="bg-background px-1 rounded">user@123</code></p>
            <p>Password: <code className="bg-background px-1 rounded">user123</code></p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
