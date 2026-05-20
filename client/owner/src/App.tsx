import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { queryClient } from "@/lib/queryClient";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import LoginPage from "@/features/auth/LoginPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import BookingsPage from "@/features/bookings/BookingsPage";
import { PlaceholderPage } from "@/pages/stub/PlaceholderPage";

const STUBS = [
  ["services", "Services"],
  ["barbers", "Barbers / Staff"],
  ["customers", "Customers"],
  ["products", "Products"],
  ["offers", "Offers & Discounts"],
  ["blogs", "Blogs"],
  ["holidays", "Holidays & Timings"],
  ["payments", "Payments"],
  ["reports", "Reports & Analytics"],
  ["settings", "Settings"],
] as const;

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="bookings" element={<BookingsPage />} />
                    {STUBS.map(([path, label]) => (
                      <Route
                        key={path}
                        path={path}
                        element={<PlaceholderPage title={label} />}
                      />
                    ))}
                  </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster richColors position="top-right" />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
