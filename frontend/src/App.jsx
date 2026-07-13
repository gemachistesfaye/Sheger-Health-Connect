import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// Layouts
import PublicLayout from "./layouts/PublicLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

// Public Pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import NotFound from "./pages/NotFound.jsx";

// Dashboards
import PatientDashboard from "./dashboard/PatientDashboard.jsx";
import DoctorDashboard from "./dashboard/DoctorDashboard.jsx";
import AdminDashboard from "./dashboard/AdminDashboard.jsx";
import FeatureUpgrade from "./components/FeatureUpgrade.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import RecordsPage from "./pages/RecordsPage.jsx";
import DoctorsPage from "./pages/DoctorsPage.jsx";
import AIAssistantPage from "./pages/AIAssistantPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import BillingPage from "./pages/BillingPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";

// Admin Pages
import DoctorManagement from "./pages/admin/DoctorManagement.jsx";
import SystemLogs from "./pages/admin/SystemLogs.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import AdminPayments from "./pages/admin/PaymentsPage.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />

        {/* Protected Patient Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Patient']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/appointments" element={<AppointmentsPage />} />
            <Route path="/patient/records" element={<RecordsPage />} />
            <Route path="/patient/doctors" element={<DoctorsPage />} />
            <Route path="/patient/ai" element={<AIAssistantPage />} />
            <Route path="/patient/notifications" element={<NotificationsPage />} />
            <Route path="/patient/messages" element={<MessagesPage />} />
            <Route path="/patient/billing" element={<BillingPage />} />
            <Route path="/patient/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Protected Doctor Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Doctor']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<AppointmentsPage />} />
            <Route path="/doctor/messages" element={<MessagesPage />} />
            <Route path="/doctor/profile" element={<FeatureUpgrade />} />
            <Route path="/doctor/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<DoctorManagement />} />
            <Route path="/admin/messages" element={<MessagesPage />} />
            <Route path="/admin/system" element={<SystemLogs />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
