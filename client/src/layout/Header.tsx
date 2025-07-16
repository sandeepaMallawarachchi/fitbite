// src/layout/Header.tsx
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300`}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-[40px] mt-[20px] mb-[10px] flex items-center justify-between">
        {/* Logo */}
        <Link to={"/"}>
          <img
            src="/logo1.png"
            alt="fite bite Logo"
            className="h-10 w-auto cursor-pointer"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center space-x-10 lg:space-x-20 font-bold text-md">
          <a href="/Features">Features</a>
          <a href="/Feedbacks">Feedbacks</a>
          <a href="/Contact">Contact</a>
        </nav>

        {/* Contact Button */}
        <div className="hidden md:flex gap-x-4 lg:gap-x-8">
          <button
            onClick={() => navigate("/SignUp")}
            className="text-black px-8 py-2 rounded-md text-md font-semibold bg-[var(--green1)]"
          >
            Sign up
          </button>
          <button
            onClick={() => navigate("/SignIn")}
            className="text-black px-8 py-2 border rounded-md text-md font-semibold"
          >
            Sign in
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMobileMenu}
          className={`md:hidden  p-2 hover:bg-red/10 rounded-md transition-colors`}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-[var(--havit-red)]" />
          ) : (
            <Menu className="h-6 w-6 text-[var(--havit-red)]" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden rounded-b-2xl opacity-100 bg-green-200/90  px-4 transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <nav className="px-6 py-4 space-y-3 ">
          <a
            href="/Features"
            onClick={closeMobileMenu}
            className="block w-full text-center text-black font-semibold border-b border-green-400 py-2 hover:bg-[var(--green2)] transition"
          >
            Feedbacks
          </a>
          <a
            href="/Contact"
            onClick={closeMobileMenu}
            className="block w-full text-center text-black font-semibold border-b border-green-400 py-2 hover:bg-[var(--green2)] transition"
          >
            Contact
          </a>
          <a
            href="/Features"
            onClick={closeMobileMenu}
            className="block w-full text-center text-black font-semibold border-b border-green-400 py-2 hover:bg-[var(--green2)] transition"
          >
            Features
          </a>
          <div className=" flex gap-4 justify-center pt-6">
            <button
              onClick={() => navigate("/SignUp")}
              className="text-black px-8 py-2 rounded-md text-md font-semibold bg-[var(--green1)]"
            >
              Sign up
            </button>
            <button
              onClick={() => navigate("/SignIn")}
              className="text-black px-8 py-2 border rounded-md text-md font-semibold"
            >
              Sign in
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
