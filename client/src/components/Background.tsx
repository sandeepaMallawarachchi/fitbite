"use client";

import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import SignUpStep1 from "../auth/SignUpStep1";
import SignUpForm from "../auth/SignUpForm";
import SignUpStep2 from "../auth/SignUpStep2";
import SignIn from "../auth/SignIn";

const Background = () => {

    const location = useLocation();

    const renderComponent = () => {
        if (location.pathname === "/SignUp") return <SignUpForm />;
        if (location.pathname === "/SignUpStep1") return <SignUpStep1 />;
        if (location.pathname === "/SignUpStep2") return <SignUpStep2 />;
        if (location.pathname === "/SignIn") return <SignIn />;
        return <p className="text-red-500 text-xl">Invalid step</p>;
    };

    return (
        <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <motion.div
                initial={{ x: 100, y: 100, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 bg-fit bg-center bg-no-repeat z-0"
                style={{ backgroundImage: `url('/common-bg.png')` }}
            />
            {/* Logo */}
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
                <Link to="/">
                    <img
                        src="/logo2.png"
                        alt="fitbite Logo"
                        className="h-8 sm:h-10 w-auto cursor-pointer"
                    />
                </Link>
            </div>

            <div className="z-10">{renderComponent()}</div>
        </div>
    );
}

export default Background;