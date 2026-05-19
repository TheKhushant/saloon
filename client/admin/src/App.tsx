import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import LoginPage from "@/pages/admin/LoginPage";
import ForgotPasswordPage from "@/pages/admin/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/admin/ResetPasswordPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import VendorsPage from "@/pages/admin/VendorsPage";
import AddVendorPage from "@/pages/admin/AddVendorPage";
import EditVendorPage from "@/pages/admin/EditVendorPage";
import BranchesPage from "@/pages/admin/BranchesPage";
import AddBranchPage from "@/pages/admin/AddBranchPage";
import EditBranchPage from "@/pages/admin/EditBranchPage";
import BookingsPage from "@/pages/admin/BookingsPage";
import CustomersPage from "@/pages/admin/CustomersPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import TemplatesPage from "@/pages/admin/TemplatesPage";
import HostingPage from "@/pages/admin/HostingPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <AuthProvider> */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<DashboardPage />} />
              <Route path="vendors" element={<VendorsPage />} />
              <Route path="vendors/add" element={<AddVendorPage />} />
              <Route path="vendors/:id/edit" element={<EditVendorPage />} />
              <Route path="branches" element={<BranchesPage />} />
              <Route path="branches/add" element={<AddBranchPage />} />
              <Route path="branches/:id/edit" element={<EditBranchPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="templates" element={<TemplatesPage />} />
              <Route path="hosting" element={<HostingPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    {/* </AuthProvider> */}
  </QueryClientProvider>
);

export default App;
