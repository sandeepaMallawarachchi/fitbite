import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { FormData } from '../types/FormData';

type FormContextType = {
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  resetFormData: () => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const initialData = localStorage.getItem("formData");

  const [formData, setFormDataState] = useState<FormData>(() => {
    return initialData ? JSON.parse(initialData) : {};
  });

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const setFormData = (data: Partial<FormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormDataState({});
    localStorage.removeItem("formData");
  };

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