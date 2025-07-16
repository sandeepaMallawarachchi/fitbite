import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type FormData = {
    name?: string;
    email?: string;
    phone?: string;
    weight?: string;
    height?: string;
    birthday?: string;
    gender?: string;
    activityLevel?: string;
    selectedGoal?: string;
    goalWeight?: string;
    progressRate?: string;
};

type FormContextType = {
    formData: FormData;
    setFormData: (data: Partial<FormData>) => void;
    resetFormData: () => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    const [formData, setFormDataState] = useState<FormData>({
        email: parsedUser?.email || "",
    });

    const setFormData = (data: Partial<FormData>) => {
        setFormDataState((prev) => ({ ...prev, ...data }));
    };

    const resetFormData = () => setFormDataState({});

    return (
        <FormContext.Provider value={{ formData, setFormData, resetFormData }}>
            {children}
        </FormContext.Provider>
    );
};

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useFormContext must be used within a FormProvider");
    }
    return context;
};
