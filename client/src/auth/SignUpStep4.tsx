"use client";

import DietaryDetails from "../components/DietaryDetails";


export default function SignUpStep1() {
  return (
    <section className="z-10 bg-white rounded-xl shadow-xl max-w-5xl w-full min-h-[90vh] lg:px-18 px-4 md:px-6  py-6 space-y-6">
      {/* <SignUp/> */}
      <DietaryDetails />
    </section>
  );
}
