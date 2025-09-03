import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { tokenControl } from "./utils/helpers";
import { API } from "./api/axiosInstance";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import Loader from "./components/ui/loader";
import { AdminLayout } from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import Payments from "./pages/Payments";
import LoginHistory from "./pages/LoginHistory";
import UsersRoles from "./pages/UsersRoles";
import ImportData from "./pages/ImportData";
import MCAManagement from "./pages/data/MCAManagement";
import GSTManagement from "./pages/data/GSTManagement";
import ImportExportManagement from "./pages/data/ImportExportManagement";
import NotAuthorized from "./pages/NotAuthorized";
import Subscriptions from "./pages/Subscriptions";
import NotFound from "./pages/NotFound";
import Banner from "./pages/Banner";

const queryClient = new QueryClient();

const App = () => {
  const RouterInner = () => {
    const { checking, isAuthenticated, user } = useAuth();

    const getDefaultRoute = (user: { role: string; permissions: string[] }) => {
      if (!user) return null;
      if (user.role === "Admin") return "/dashboard";

      const orderedRoutes: { permission: string; path: string }[] = [
        { permission: "dashboard.edit", path: "/dashboard" },
        { permission: "client.edit", path: "/clients" },
        { permission: "payment.edit", path: "/payments" },
        { permission: "banner.edit", path: "/banner" },
        { permission: "subscription.edit", path: "/subscriptions" },
        { permission: "login_history.edit", path: "/login-history" },
        { permission: "mca.edit", path: "/data/mca" },
        { permission: "gst.edit", path: "/data/gst" },
        { permission: "import_export.edit", path: "/data/import-export" },
        { permission: "user_roles.edit", path: "/users-roles" },
        { permission: "import_data.edit", path: "/import-data" },
      ];

      const permissions: string[] = user.permissions ?? [];
      const match = orderedRoutes.find((r) =>
        permissions.includes(r.permission)
      );
      return match ? match.path : null;
    };

    const ProtectedRoute: React.FC<{
      permission?: string;
      children: React.ReactNode;
    }> = ({ permission, children }) => {
      if (!isAuthenticated) return <Navigate to="/" replace />;

      const permissions: string[] = user?.permissions ?? [];
      if (
        permission &&
        !permissions.includes(permission) &&
        user?.role !== "Admin"
      )
        return <NotAuthorized />;

      return <>{children}</>;
    };

    if (checking) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader />
        </div>
      );
    }

    const defaultRoute = isAuthenticated ? getDefaultRoute(user) : null;

    return (
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={defaultRoute ?? "/not-authorized"} replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute permission="dashboard.edit">
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute permission="client.edit">
              <AdminLayout>
                <Clients />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute permission="client.edit">
              <AdminLayout>
                <ClientDetails />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute permission="payment.edit">
              <AdminLayout>
                <Payments />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/banner"
          element={
            <ProtectedRoute permission="banner.edit">
              <AdminLayout>
                <Banner />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute permission="subscription.edit">
              <AdminLayout>
                <Subscriptions />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login-history"
          element={
            <ProtectedRoute permission="login_history.edit">
              <AdminLayout>
                <LoginHistory />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/data/mca"
          element={
            <ProtectedRoute permission="mca.edit">
              <AdminLayout>
                <MCAManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/data/gst"
          element={
            <ProtectedRoute permission="gst.edit">
              <AdminLayout>
                <GSTManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/data/import-export"
          element={
            <ProtectedRoute permission="import_export.edit">
              <AdminLayout>
                <ImportExportManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users-roles"
          element={
            <ProtectedRoute permission="user_roles.edit">
              <AdminLayout>
                <UsersRoles />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/import-data"
          element={
            <ProtectedRoute permission="import_data.edit">
              <AdminLayout>
                <ImportData />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <RouterInner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
