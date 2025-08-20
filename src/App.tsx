import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
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
        <AdminLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/login-history" element={<LoginHistory />} />
            <Route path="/data/mca" element={<MCAManagement />} />
            <Route path="/data/gst" element={<GSTManagement />} />
            <Route path="/data/import-export" element={<ImportExportManagement />} />
            <Route path="/users-roles" element={<UsersRoles />} />
            <Route path="/import-data" element={<ImportData />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
