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
            <Route index element={<DashboardHome />} />
            <Route path="add-client-step1" element={<AddClientStep1 />} />
            <Route path="add-client-step2" element={<AddClientStep2 />} />
            {/* <Route path="meal-plan" element={<MealPlan />} />
          <Route path="progress" element={<Progress />} />
          <Route path="profile" element={<Profile />} />
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
