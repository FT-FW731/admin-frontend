import { useState, useEffect } from "react";
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
import { API } from "@/api/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  const navigate = useNavigate();
  const token = tokenControl("get");

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInLoading(true);
    const { data } = await API.post("/auth/login", { email, password });
    if (data && data?.token) {
      tokenControl("set", data.token);
      navigate("/dashboard");
    }
    setSignInLoading(false);
  };

  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero/Branding */}
      <div className="flex-1 bg-gradient-primary flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full">
              <Building2 className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
          <p className="text-xl opacity-90 mb-8">
            Manage your business operations with our comprehensive admin
            dashboard
          </p>
          <div className="flex items-center justify-center gap-4 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Secure Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Enterprise Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
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
