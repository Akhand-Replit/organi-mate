
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
import EmployeeReports from "./pages/employee/Reports";
import EmployeeMessages from "./pages/employee/Messages";
import EmployeeTasks from "./pages/employee/Tasks";
import EmployeeProfile from "./pages/employee/Profile";

// Branch Manager pages
import BranchDashboard from "./pages/branch/Dashboard";
import BranchEmployees from "./pages/branch/Employees";
import BranchCreateEmployee from "./pages/branch/CreateEmployee";
import BranchTasks from "./pages/branch/Tasks";
import BranchReports from "./pages/branch/Reports";
import BranchMessages from "./pages/branch/Messages";
import BranchSettings from "./pages/branch/Settings";

// Assistant Manager pages
import AssistantDashboard from "./pages/assistant/Dashboard";
import AssistantEmployees from "./pages/assistant/Employees";
import AssistantCreateEmployee from "./pages/assistant/CreateEmployee";
import AssistantTasks from "./pages/assistant/Tasks";
import AssistantReports from "./pages/assistant/Reports";
import AssistantMessages from "./pages/assistant/Messages";
import AssistantProfile from "./pages/assistant/Profile";

// Job Seeker pages
import JobSeekerDashboard from "./pages/jobseeker/Dashboard";
import JobSeekerJobs from "./pages/jobseeker/Jobs";
import JobSeekerApplications from "./pages/jobseeker/Applications";
import JobSeekerProfile from "./pages/jobseeker/Profile";
import JobSeekerMessages from "./pages/jobseeker/Messages";

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

            {/* Branch Manager routes */}
            <Route path="/branch/dashboard" element={<BranchDashboard />} />
            <Route path="/branch/employees" element={<BranchEmployees />} />
            <Route path="/branch/create-employee" element={<BranchCreateEmployee />} />
            <Route path="/branch/tasks" element={<BranchTasks />} />
            <Route path="/branch/reports" element={<BranchReports />} />
            <Route path="/branch/messages" element={<BranchMessages />} />
            <Route path="/branch/settings" element={<BranchSettings />} />

            {/* Assistant Manager routes */}
            <Route path="/assistant/dashboard" element={<AssistantDashboard />} />
            <Route path="/assistant/employees" element={<AssistantEmployees />} />
            <Route path="/assistant/create-employee" element={<AssistantCreateEmployee />} />
            <Route path="/assistant/tasks" element={<AssistantTasks />} />
            <Route path="/assistant/reports" element={<AssistantReports />} />
            <Route path="/assistant/messages" element={<AssistantMessages />} />
            <Route path="/assistant/profile" element={<AssistantProfile />} />

            {/* Employee routes */}
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/reports" element={<EmployeeReports />} />
            <Route path="/employee/messages" element={<EmployeeMessages />} />
            <Route path="/employee/tasks" element={<EmployeeTasks />} />
            <Route path="/employee/profile" element={<EmployeeProfile />} />

            {/* Job Seeker routes */}
            <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />} />
            <Route path="/jobseeker/jobs" element={<JobSeekerJobs />} />
            <Route path="/jobseeker/applications" element={<JobSeekerApplications />} />
            <Route path="/jobseeker/profile" element={<JobSeekerProfile />} />
            <Route path="/jobseeker/messages" element={<JobSeekerMessages />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
