import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './layout/Header';
import Home from './pages/Home';
import Background from './components/Background';
import toast, { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import DashboardLayout from "./layout/DashboardLayout"
import DashboardHome from "./pages/dashboard/DashboardHome"
import ProtectedRoute from "./auth/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import AddClientStep1 from './components/addClientSteps/AddClientStep1';
import AddClientStep2 from './components/addClientSteps/AddClientStep2';
import AddClientStep3 from './components/addClientSteps/AddClientStep3';
import AddClientStep4 from './components/addClientSteps/AddClientStep4';
import AddClientStep5 from './components/addClientSteps/AddClientStep5';
import AddClientStep6 from './components/addClientSteps/AddClientStep6';
import AddClientStep7 from './components/addClientSteps/AddClientStep7';
import ClientSignUp from './components/addClientSteps/ClientSignUp';
import CoachDashboard from './pages/dashboard/CoachDashboard';
import SmartMealAssistantWrapper from './pages/SmartMealAssistantWrapper';
import ClientsDetailsTable from './pages/ClientsDetailsTable';
import Profile from './pages/Profile';

function AppContent() {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname === "/SignIn" ||
    location.pathname === "/SignUp" ||
    location.pathname === "/YourTDEE" ||
    location.pathname === "/SignUpStep1" ||
    location.pathname === "/HowtoCalcTDEE" ||
    location.pathname === "/SignUpStep2" ||
    location.pathname === "/SignUpStep3" ||
    location.pathname === "/SignUpStep4" ||
    location.pathname === "/SignUpStep5" ||
    location.pathname === "/SignUpStep6" ||
    location.pathname.startsWith("/dashboard");

  const { shouldRedirect, clearRedirect } = useAuth();
  const navigate = useNavigate();
  const role = localStorage.getItem("coachRole");

  useEffect(() => {
    if (shouldRedirect) {
      toast.error("You’ve been logged out", {
        duration: 3000,
      });
      navigate("/");
      clearRedirect();
    }
  }, [shouldRedirect]);


  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Toaster position="top-center" />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SignIn" element={<Background />} />
        <Route path="/SignUp" element={<Background />} />
        <Route path="/SignUpStep1" element={<Background />} />
        <Route path="/SignUpStep2" element={<Background />} />
        <Route path="/SignUpStep3" element={<Background />} />
        <Route path="/SignUpStep4" element={<Background />} />
        <Route path="/SignUpStep5" element={<Background />} />
        <Route path="/SignUpStep6" element={<Background />} />
        <Route path="/YourTDEE" element={<Background />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route
              index
              element={role === "Coach" ? <CoachDashboard /> : <DashboardHome />}
            />
            <Route path="add-client-step1" element={<AddClientStep1 />} />
            <Route path="add-client-step2" element={<AddClientStep2 />} />
            <Route path="add-client-step3" element={<AddClientStep3 />} />
            <Route path="add-client-step4" element={<AddClientStep4 />} />
            <Route path="add-client-step5" element={<AddClientStep5 />} />
            <Route path="add-client-step6" element={<AddClientStep6 />} />
            <Route path="add-client-step7" element={<AddClientStep7 />} />
            <Route path="client-signup" element={<ClientSignUp />} />
            <Route path="coach-dashboard" element={<CoachDashboard />} />
            <Route path="smart-assistant" element={<SmartMealAssistantWrapper />} />
            <Route path="clients" element={<ClientsDetailsTable />} />
            <Route path="profile" element={<Profile />} />
            {/* <Route path="meal-plan" element={<MealPlan />} />
          <Route path="progress" element={<Progress />} />
          <Route path="settings" element={<Settings />} /> */}
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
