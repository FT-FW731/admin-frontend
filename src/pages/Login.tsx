import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Shield } from "lucide-react";
import { tokenControl } from "@/utils/helpers";
import { useAuth } from "@/hooks/use-auth";
import { API } from "@/api/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInLoading(true);
    const { data } = await API.post("/auth/login", { email, password });
    if (data && data?.token) {
      tokenControl("set", data.token);
      await checkAuth();
      navigate("/");
    }
    setSignInLoading(false);
  };

  // if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] bg-[length:24px_24px]" />
      </div>

      {/* Left Side - Hero/Branding */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="text-center text-[#1a2a3a] max-w-md">
          {/* Fact Flow Technologies Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/ff-logo.png"
              alt="Fact Flow Technologies"
              className="h-16 w-auto mx-auto drop-shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div className="flex justify-center mb-6">
            <div className="bg-white/30 backdrop-blur-sm p-4 rounded-full shadow-lg border border-white/40">
              <Building2 className="h-12 w-12 text-[#1a2a3a]" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Fact Flow Admin Panel
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#1a2a3a]" />
              <span>Secure Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#1a2a3a]" />
              <span>Only for authorized users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your admin account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                loading={signInLoading}
                size="lg"
              >
                Sign In
              </Button>
            </form>
            {/* <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Demo credentials: Any email/password will work</p>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
