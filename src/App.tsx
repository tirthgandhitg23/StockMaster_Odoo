import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// AUTH PAGES
import { LoginPage } from "./pages/auth/LoginPage";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";

// LAYOUT & DASHBOARD
import { MainLayout } from "./layout/MainLayout";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { ProductsPage } from "./pages/products/ProductsPage";
import { ReceiptsPage } from "./pages/operations/ReceiptsPage";
import { DeliveriesPage } from "./pages/operations/DeliveriesPage";
import { TransfersPage } from "./pages/operations/TransfersPage";
import { AdjustmentsPage } from "./pages/operations/AdjustmentsPage";
import { HistoryPage } from "./pages/operations/HistoryPage";
import { VendorsPage } from "./pages/vendors/VendorsPage";
import { LocationsPage } from "./pages/locations/LocationsPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// --- SECURITY WRAPPER ---
// This checks if a token exists. If not, it kicks the user back to Login.
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* --- PROTECTED ROUTES --- */}
          {/* Any route inside here requires a login token */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/operations/receipts" element={<ReceiptsPage />} />
              <Route path="/operations/deliveries" element={<DeliveriesPage />} />
              <Route path="/operations/transfers" element={<TransfersPage />} />
              <Route path="/operations/adjustments" element={<AdjustmentsPage />} />
              <Route path="/operations/history" element={<HistoryPage />} />
              <Route path="/vendors" element={<VendorsPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;