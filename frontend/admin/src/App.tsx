import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AdminOnlyRoute } from "@/components/admin/AdminOnlyRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import LoginPage from "@/pages/admin/LoginPage";
import ForgotPasswordPage from "@/pages/admin/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/admin/ResetPasswordPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import BranchesPage from "@/pages/admin/BranchesPage";
import AddBranchPage from "@/pages/admin/AddBranchPage";
import EditBranchPage from "@/pages/admin/EditBranchPage";
import ServicesPage from "@/pages/admin/ServicesPage";
import BarbersPage from "@/pages/admin/BarbersPage";
import BookingsPage from "@/pages/admin/BookingsPage";
import AddBookingPage from "@/pages/admin/AddBookingPage";
import CustomersPage from "@/pages/admin/CustomersPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import ProductsPage from "@/pages/admin/ProductsPage";
import OffersPage from "@/pages/admin/OffersPage";
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
              <Route path="branches" element={<BranchesPage />} />
              <Route path="branches/add" element={<AdminOnlyRoute><AddBranchPage /></AdminOnlyRoute>} />
              <Route path="branches/:id/edit" element={<EditBranchPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="barbers" element={<BarbersPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="bookings/add" element={<AddBookingPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="offers" element={<OffersPage />} />
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
