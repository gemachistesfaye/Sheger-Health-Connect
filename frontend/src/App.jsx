import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import CookieConsent from "./components/CookieConsent";

// Layouts
import PublicLayout from "./layouts/PublicLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>
);

// Lazy-loaded Public Pages
const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Services = lazy(() => import("./pages/Services.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

// Lazy-loaded Dashboards
const PatientDashboard = lazy(() => import("./dashboard/PatientDashboard.jsx"));
const DoctorDashboard = lazy(() => import("./dashboard/DoctorDashboard.jsx"));
const AdminDashboard = lazy(() => import("./dashboard/AdminDashboard.jsx"));
const FeatureUpgrade = lazy(() => import("./components/FeatureUpgrade.jsx"));
const AppointmentsPage = lazy(() => import("./pages/AppointmentsPage.jsx"));
const RecordsPage = lazy(() => import("./pages/RecordsPage.jsx"));
const DoctorsPage = lazy(() => import("./pages/DoctorsPage.jsx"));
const AIAssistantPage = lazy(() => import("./pages/AIAssistantPage.jsx"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage.jsx"));
const BillingPage = lazy(() => import("./pages/BillingPage.jsx"));
const SettingsPage = lazy(() => import("./pages/SettingsPage.jsx"));
const MessagesPage = lazy(() => import("./pages/MessagesPage.jsx"));

// Lazy-loaded Admin Pages
const DoctorManagement = lazy(() => import("./pages/admin/DoctorManagement.jsx"));
const SystemLogs = lazy(() => import("./pages/admin/SystemLogs.jsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.jsx"));
const AdminPayments = lazy(() => import("./pages/admin/PaymentsPage.jsx"));

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<RouteErrorBoundary><Home /></RouteErrorBoundary>} />
            <Route path="/about" element={<RouteErrorBoundary><About /></RouteErrorBoundary>} />
            <Route path="/services" element={<RouteErrorBoundary><Services /></RouteErrorBoundary>} />
            <Route path="/contact" element={<RouteErrorBoundary><Contact /></RouteErrorBoundary>} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<RouteErrorBoundary><Login /></RouteErrorBoundary>} />
          <Route path="/register" element={<RouteErrorBoundary><Register /></RouteErrorBoundary>} />
          <Route path="/forgot-password" element={<RouteErrorBoundary><ForgotPassword /></RouteErrorBoundary>} />
          <Route path="/resetpassword/:token" element={<RouteErrorBoundary><ResetPassword /></RouteErrorBoundary>} />

          {/* Protected Patient Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Patient']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/patient/dashboard" element={<RouteErrorBoundary><PatientDashboard /></RouteErrorBoundary>} />
              <Route path="/patient/appointments" element={<RouteErrorBoundary><AppointmentsPage /></RouteErrorBoundary>} />
              <Route path="/patient/records" element={<RouteErrorBoundary><RecordsPage /></RouteErrorBoundary>} />
              <Route path="/patient/doctors" element={<RouteErrorBoundary><DoctorsPage /></RouteErrorBoundary>} />
              <Route path="/patient/ai" element={<RouteErrorBoundary><AIAssistantPage /></RouteErrorBoundary>} />
              <Route path="/patient/notifications" element={<RouteErrorBoundary><NotificationsPage /></RouteErrorBoundary>} />
              <Route path="/patient/messages" element={<RouteErrorBoundary><MessagesPage /></RouteErrorBoundary>} />
              <Route path="/patient/billing" element={<RouteErrorBoundary><BillingPage /></RouteErrorBoundary>} />
              <Route path="/patient/settings" element={<RouteErrorBoundary><SettingsPage /></RouteErrorBoundary>} />
            </Route>
          </Route>

          {/* Protected Doctor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Doctor']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/doctor/dashboard" element={<RouteErrorBoundary><DoctorDashboard /></RouteErrorBoundary>} />
              <Route path="/doctor/appointments" element={<RouteErrorBoundary><AppointmentsPage /></RouteErrorBoundary>} />
              <Route path="/doctor/messages" element={<RouteErrorBoundary><MessagesPage /></RouteErrorBoundary>} />
              <Route path="/doctor/profile" element={<RouteErrorBoundary><FeatureUpgrade /></RouteErrorBoundary>} />
              <Route path="/doctor/settings" element={<RouteErrorBoundary><SettingsPage /></RouteErrorBoundary>} />
            </Route>
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<RouteErrorBoundary><AdminDashboard /></RouteErrorBoundary>} />
              <Route path="/admin/users" element={<RouteErrorBoundary><DoctorManagement /></RouteErrorBoundary>} />
              <Route path="/admin/messages" element={<RouteErrorBoundary><MessagesPage /></RouteErrorBoundary>} />
              <Route path="/admin/system" element={<RouteErrorBoundary><SystemLogs /></RouteErrorBoundary>} />
              <Route path="/admin/payments" element={<RouteErrorBoundary><AdminPayments /></RouteErrorBoundary>} />
              <Route path="/admin/settings" element={<RouteErrorBoundary><AdminSettings /></RouteErrorBoundary>} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<RouteErrorBoundary><NotFound /></RouteErrorBoundary>} />
        </Routes>
        <CookieConsent />
      </Suspense>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
