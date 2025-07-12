import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './layout/Header';
import Home from './pages/Home';
import Sample from './pages/Sample';
import SignIn from './auth/SignIn';
import SignUpForm from './auth/SignUpForm';
import YourTDEE from './components/YourTDEE';
import SignUpStep1 from "./auth/SignUpStep1"

function AppContent() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/SignIn" || location.pathname === "/SignUp" || location.pathname === "/YourTDEE" || location.pathname === "/SignUpStep1";

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sample" element={<Sample />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUpForm />} />

        <Route path="/YourTDEE" element={<YourTDEE />} />
        <Route path="/SignUpStep1" element={<SignUpStep1 />} />

        
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
