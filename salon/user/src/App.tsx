import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { BookingsProvider } from "@/context/BookingsContext";
import SalonIntroLoader from "./components/SalonIntroLoader";
import Index from "./pages/Index";
import SalonListing from "./pages/SalonListing";
import SalonDetails from "./pages/SalonDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ClientDashboard from "./pages/ClientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import QuickBooking from "./pages/QuickBooking";
import Products from "./pages/Products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const queryClient = new QueryClient();

// const App = () => {
//   const [showIntro, setShowIntro] = useState(true);
//   const handleIntroComplete = useCallback(() => setShowIntro(false), []);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         {showIntro && <SalonIntroLoader onComplete={handleIntroComplete} />}
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Index />} />
//             <Route path="/salons" element={<SalonListing />} />
//             <Route path="/salon/:id" element={<SalonDetails />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/dashboard" element={<ClientDashboard />} />
//             <Route path="/admin" element={<AdminDashboard />} />
//             <Route path="/blog" element={<Blog />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// };
const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  if (showIntro) {
    return <SalonIntroLoader onComplete={handleIntroComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BookingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/salons" element={<SalonListing />} />
              <Route path="/salon/:id" element={<SalonDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<ClientDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/service" element={<SalonListing />} />
              <Route path="/products" element={<Products />} />
              <Route
                path="/quickbooking"
                element={
                  <div className="min-h-screen bg-background">
                    <Navbar />
                    <div className="pt-16">
                      <QuickBooking />
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
                      <QuickBooking />
                    </div>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/book/:serviceId"
                element={
                  <div className="min-h-screen bg-background">
                    <Navbar />
                    <div className="pt-16">
                      <QuickBooking />
                    </div>
                    <Footer />
                  </div>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </BookingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
export default App;