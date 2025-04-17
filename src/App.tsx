
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
import CompanyApplication from "./pages/CompanyApplication";
import Jobs from "./pages/Jobs";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Companies from "./pages/admin/Companies";
import CreateCompany from "./pages/admin/CreateCompany";
import AdminMessages from "./pages/admin/Messages";
import AdminUsers from "./pages/admin/Users";
import AdminSubscriptions from "./pages/admin/Subscriptions";
import AdminReports from "./pages/admin/Reports";
import AdminJobs from "./pages/admin/Jobs";
import AdminSettings from "./pages/admin/Settings";

// Company pages
import CompanyDashboard from "./pages/company/Dashboard";
import CreateEmployee from "./pages/company/CreateEmployee";
import Branches from "./pages/company/Branches";
import Employees from "./pages/company/Employees";

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
            <Route path="/company-application" element={<CompanyApplication />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes - accessible by any authenticated user */}
            <Route path="/messages" element={<Messages />} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/companies" element={<Companies />} />
            <Route path="/admin/create-company" element={<CreateCompany />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* Company routes */}
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/create-employee" element={<CreateEmployee />} />
            <Route path="/company/branches" element={<Branches />} />
            <Route path="/company/employees" element={<Employees />} />

            {/* Employee routes */}
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
