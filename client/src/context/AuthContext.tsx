import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import type { ReactNode } from "react";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  shouldRedirect: boolean;
  clearRedirect: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const INACTIVITY_LIMIT_MS = 60 * 1000;
const INACTIVITY_LIMIT_MS = 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShouldRedirect(true);
  }, []);

  const clearRedirect = () => setShouldRedirect(false);

  const login = (user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
    setToken(token);
    resetInactivityTimer();
  };

  const resetInactivityTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      console.warn("User inactive — logging out.");
      logout();
    }, INACTIVITY_LIMIT_MS);
  }, [logout]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      resetInactivityTimer();
    }
  }, [resetInactivityTimer]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    const activityHandler = () => {
      if (user && token) resetInactivityTimer();
    };

    events.forEach((event) =>
      window.addEventListener(event, activityHandler)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, activityHandler)
      );
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resetInactivityTimer, user, token]);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, shouldRedirect, clearRedirect }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
