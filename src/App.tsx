
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import CreateCompany from "./pages/admin/CreateCompany";

// Company pages
import CompanyDashboard from "./pages/company/Dashboard";
import CreateEmployee from "./pages/company/CreateEmployee";

// Branch pages
import BranchDashboard from "./pages/branch/Dashboard";

// Employee pages
import EmployeeDashboard from "./pages/employee/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/create-company" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CreateCompany />
                </ProtectedRoute>
              } 
            />

            {/* Company routes */}
            <Route 
              path="/company/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CompanyDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company/create-employee" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CreateEmployee />
                </ProtectedRoute>
              } 
            />

            {/* Branch routes */}
            <Route 
              path="/branch/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['branch_manager', 'assistant_manager']}>
                  <BranchDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Employee routes */}
            <Route 
              path="/employee/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
