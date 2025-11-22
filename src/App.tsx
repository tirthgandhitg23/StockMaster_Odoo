import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// AUTH PAGES IMPORTS
import { LoginPage } from "./pages/auth/LoginPage";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage"; 

// LAYOUT & DASHBOARD IMPORTS
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
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* --- AUTHENTICATION ROUTES --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* This is the link that was missing/broken */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* --- PROTECTED ROUTES --- */}
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

           
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;