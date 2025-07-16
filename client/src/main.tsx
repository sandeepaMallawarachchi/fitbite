import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { FormProvider } from "./context/FormContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <FormProvider>
        <App />
      </FormProvider>
    </AuthProvider>
  </StrictMode>
);
