"use client";

import TellABoutYouForm from "../components/TellABoutYouForm";

export default function SignUp() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat z-0"
        style={{ backgroundImage: `url('/common-bg.png')` }}
      />

      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
        <a href="/">
          <img
            src="/vite.png"
            alt="fitbite Logo"
            className="h-8 sm:h-10 w-auto cursor-pointer"
          />
        </a>
      </div>
      <div className="z-10 bg-white rounded-xl shadow-xl max-w-5xl w-full mx-8 sm:mx-8 md:mx-24 lg:px-18 px-4 md:px-6  py-6 space-y-6">
        <TellABoutYouForm />
      </div>
    </section>
  );
}
