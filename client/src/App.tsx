import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './layout/Header';
import Home from './pages/Home';
import Sample from './pages/Sample';
import SignIn from './auth/SignIn';
import SignUpForm from './auth/SignUpForm';
import YourTDEE from './components/YourTDEE';
import SignUpStep1 from "./auth/SignUpStep1";
import SignUpStep2 from "./auth/SignUpStep2"
import HowtoCalcTDEE from './components/HowtoCalcTDEE';
import FitnessGoal from './components/FitnessGoal';
import Background from './components/Background';

function AppContent() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/SignIn" || location.pathname === "/SignUp" || location.pathname === "/YourTDEE" || location.pathname === "/SignUpStep1" || location.pathname === "/HowtoCalcTDEE" || location.pathname === "/SignUpStep2";

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sample" element={<Sample />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUpForm />} />

        <Route path="/SignUpStep1" element={<Background />} />
        <Route path="/SignUpStep2" element={<SignUpStep2 />} />

        <Route path="/YourTDEE" element={<YourTDEE />} />
        <Route path="/HowtoCalcTDEE" element={<HowtoCalcTDEE />} />
        <Route path="/FitnessGoal" element={<FitnessGoal />} />'

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
