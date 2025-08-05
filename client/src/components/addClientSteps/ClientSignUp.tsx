"use client";

import SignUpForm from "../../auth/SignUpForm";

const ClientSignUp = () => {
    return (
        <section className="w-full flex items-center justify-center">
            <div className="max-w-5xl w-full lg:px-18 px-4 md:px-6 space-y-6 py-10">
                <SignUpForm />
            </div>
        </section>
    );
}

export default ClientSignUp;