import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// AUTH PAGES
import { LoginPage } from "./pages/auth/LoginPage";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";

// LAYOUT & PAGES
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

// --- 1. BASIC PROTECTION (Must be Logged In) ---
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// --- 2. ROLE PROTECTION (Manager Only) ---
const ManagerRoute = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  
  // If user is manager, let them through. If staff, send to Dashboard.
  return user && user.role === "manager" ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* PUBLIC */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* LOGGED IN USERS (Staff & Manager) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              
              {/* SHARED ACCESS (Both roles can see these) */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/operations/history" element={<HistoryPage />} />
              
              {/* STAFF SPECIFIC ACCESS (Operations) */}
              {/* Staff perform transfers, deliveries, adjustments  */}
              <Route path="/operations/deliveries" element={<DeliveriesPage />} />
              <Route path="/operations/transfers" element={<TransfersPage />} />
              <Route path="/operations/adjustments" element={<AdjustmentsPage />} />
              <Route path="/operations/receipts" element={<ReceiptsPage />} />

              {/* MANAGER ONLY ACCESS */}
              <Route element={<ManagerRoute />}>
                <Route path="/products" element={<ProductsPage />} /> {/* Only Manager creates products */}
                <Route path="/vendors" element={<VendorsPage />} />
                <Route path="/locations" element={<LocationsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;