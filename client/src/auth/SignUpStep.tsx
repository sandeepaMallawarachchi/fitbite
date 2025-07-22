"use client";

import SignUpForm from "./SignUpForm";

export default function SignUpStep() {
    return (
        <section className="z-10 bg-white rounded-xl shadow-xl sm:w-5xl w-full min-h-[90vh] mt-10 sm:mt-0 lg:px-18 px-4 md:px-6  py-6 space-y-6">
            < SignUpForm />
        </section>
    );
}
