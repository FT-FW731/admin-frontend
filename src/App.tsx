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
import Payments from "./pages/Payments";
import LoginHistory from "./pages/LoginHistory";
import UsersRoles from "./pages/UsersRoles";
import ImportData from "./pages/ImportData";
import MCAManagement from "./pages/data/MCAManagement";
import GSTManagement from "./pages/data/GSTManagement";
import ImportExportManagement from "./pages/data/ImportExportManagement";
import NotFound from "./pages/NotFound";
import Subscriptions from "./pages/Subscriptions";
import Banner from "./pages/Banner";

const queryClient = new QueryClient();

const App = () => {
  const token = tokenControl("get");

  const RouterInner = () => {
    const { checking } = useAuth();

    if (checking) {
      // show loader while auth is validated so no pages mount and trigger API calls
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader />
        </div>
      );
    }

    return (
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/clients"
          element={
            <AdminLayout>
              <Clients />
            </AdminLayout>
          }
        />
        <Route
          path="/payments"
          element={
            <AdminLayout>
              <Payments />
            </AdminLayout>
          }
        />
        <Route
          path="/banner"
          element={
            <AdminLayout>
              <Banner />
            </AdminLayout>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <AdminLayout>
              <Subscriptions />
            </AdminLayout>
          }
        />
        <Route
          path="/login-history"
          element={
            <AdminLayout>
              <LoginHistory />
            </AdminLayout>
          }
        />
        <Route
          path="/data/mca"
          element={
            <AdminLayout>
              <MCAManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/data/gst"
          element={
            <AdminLayout>
              <GSTManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/data/import-export"
          element={
            <AdminLayout>
              <ImportExportManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/users-roles"
          element={
            <AdminLayout>
              <UsersRoles />
            </AdminLayout>
          }
        />
        <Route
          path="/import-data"
          element={
            <AdminLayout>
              <ImportData />
            </AdminLayout>
          }
        />
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
