import { useState, useCallback, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { BookingsProvider } from "@/context/BookingsContext";
import { CartProvider } from "@/context/CartContext";
import SalonIntroLoader from "./components/SalonIntroLoader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import RouteLoader from "@/components/RouteLoader";

// Route-level code splitting: each page ships as its own chunk and is
// fetched only when the user actually navigates there, keeping the
// initial bundle small for production.
const Index = lazy(() => import("./pages/Index"));
const SalonListing = lazy(() => import("./pages/SalonListing"));
const SalonDetails = lazy(() => import("./pages/SalonDetails"));
const ServiceDetails = lazy(() => import("./pages/ServiceDetails"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ClientDashboard = lazy(() => import("./pages/ClientDashboard"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const QuickBooking = lazy(() => import("./pages/QuickBooking"));
const Products = lazy(() => import("./pages/Products"));
const Cart = lazy(() => import("./pages/Cart"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  if (showIntro) {
    return <SalonIntroLoader onComplete={handleIntroComplete} />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BookingsProvider>
          <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />

            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<RouteLoader />}>
                <Routes>
                  <Route path="/" element={<PageTransition><Index /></PageTransition>} />
                  <Route path="/salons" element={<PageTransition><SalonListing /></PageTransition>} />
                  <Route path="/salon/:id" element={<PageTransition><SalonDetails /></PageTransition>} />
                  <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                  <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
                  <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
                  <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
                  <Route path="/dashboard" element={<PageTransition><ClientDashboard /></PageTransition>} />
                  <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
                  <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                  <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
                  <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
                  <Route path="/refund-policy" element={<PageTransition><RefundPolicy /></PageTransition>} />
                  <Route path="/service" element={<PageTransition><SalonListing /></PageTransition>} />
                  <Route path="/service/:id" element={<PageTransition><ServiceDetails /></PageTransition>} />
                  <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
                  <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
                  <Route
                    path="/quickbooking"
                    element={
                      <div className="min-h-screen bg-background">
                        <Navbar />
                        <div className="pt-16">
                          <PageTransition><QuickBooking /></PageTransition>
                        </div>
                        <Footer />
                      </div>
                    }
                  />
                  <Route
                    path="/book"
                    element={
                      <div className="min-h-screen bg-background">
                        <Navbar />
                        <div className="pt-16">
                          <PageTransition><QuickBooking /></PageTransition>
                        </div>
                        <Footer />
                      </div>
                    }
                  />
                  <Route
                    path="/book/:id"
                    element={
                      <div className="min-h-screen bg-background">
                        <Navbar />
                        <div className="pt-16">
                          <PageTransition><QuickBooking /></PageTransition>
                        </div>
                        <Footer />
                      </div>
                    }
                  />

                  <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
          </CartProvider>
          </BookingsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
export default App;