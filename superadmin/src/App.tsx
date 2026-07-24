import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { BranchProvider } from "@/context/BranchContext";
import { queryClient } from "@/lib/queryClient";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import LoginPage from "@/features/auth/LoginPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import BookingsPage from "@/features/bookings/BookingsPage";
import ServicesPage from "@/features/services/ServicesPage";
import BarbersPage from "@/features/barbers/BarbersPage";
import CustomersPage from "@/features/customers/CustomersPage";
import OffersPage from "@/features/offers/OffersPage";
import HolidaysPage from "@/features/holidays/HolidaysPage";
import ReportsPage from "@/features/reports/ReportsPage";
import SettingsPage from "@/features/settings/SettingsPage";
import TemplatesPage from "@/features/templates/TemplatesPage";
import ProductsPage from "@/features/products/ProductsPage";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BranchProvider>
            <TooltipProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<DashboardPage />} />
                      <Route path="bookings" element={<BookingsPage />} />
                      <Route path="services" element={<ServicesPage />} />
                      <Route path="barbers" element={<BarbersPage />} />
                      <Route path="customers" element={<CustomersPage />} />
                      <Route path="offers" element={<OffersPage />} />
                      <Route path="templates" element={<TemplatesPage />} />
                      <Route path="products" element={<ProductsPage />} />
                      <Route path="holidays" element={<HolidaysPage />} />
                      <Route path="reports" element={<ReportsPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                    </Route>
                  </Route>
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Toaster richColors position="top-right" />
              </BrowserRouter>
            </TooltipProvider>
          </BranchProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
