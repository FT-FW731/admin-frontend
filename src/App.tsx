import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          } />
          <Route path="/clients" element={
            <AdminLayout>
              <Clients />
            </AdminLayout>
          } />
          <Route path="/payments" element={
            <AdminLayout>
              <Payments />
            </AdminLayout>
          } />
          <Route path="/login-history" element={
            <AdminLayout>
              <LoginHistory />
            </AdminLayout>
          } />
          <Route path="/data/mca" element={
            <AdminLayout>
              <MCAManagement />
            </AdminLayout>
          } />
          <Route path="/data/gst" element={
            <AdminLayout>
              <GSTManagement />
            </AdminLayout>
          } />
          <Route path="/data/import-export" element={
            <AdminLayout>
              <ImportExportManagement />
            </AdminLayout>
          } />
          <Route path="/users-roles" element={
            <AdminLayout>
              <UsersRoles />
            </AdminLayout>
          } />
          <Route path="/import-data" element={
            <AdminLayout>
              <ImportData />
            </AdminLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
