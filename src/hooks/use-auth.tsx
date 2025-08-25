import React, { createContext, useContext, useEffect, useState } from "react";
import { API } from "@/api/axiosInstance";
import { tokenControl } from "@/utils/helpers";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  checking: boolean;
  isAuthenticated: boolean;
  user: any | null;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

  const checkAuth = async () => {
    const token = tokenControl("get");
    if (!token) {
      tokenControl("remove");
      setIsAuthenticated(false);
      setUser(null);
      setChecking(false);
      navigate("/", { replace: true });
      return;
    }

    setChecking(true);
    const { data } = await API.get("/auth/me");

    if (!data) {
      tokenControl("remove");
      setIsAuthenticated(false);
      setUser(null);
      setChecking(false);
      navigate("/", { replace: true });
      return;
    }

    setIsAuthenticated(true);
    setUser(data);
    setChecking(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ checking, isAuthenticated, user, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default useAuth;
