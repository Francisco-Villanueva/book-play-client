import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { setAuthInterceptor } from "@/utils/api";
import { AuthService } from "@/services/auth.service";
import type { TUser } from "@/models/user.model";

export const ACCESS_TOKEN_KEY = "access_token";

interface AuthContextType {
  token: string | null;
  user: TUser | null;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(ACCESS_TOKEN_KEY),
  );
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(() => !!token);

  useEffect(() => {
    setAuthInterceptor(token);
  }, [token]);

  const login = useCallback((newToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setToken(null);
    setUser(null);
    setIsLoadingUser(false);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setIsLoadingUser(false);
      return;
    }

    setIsLoadingUser(true);
    try {
      const me = await AuthService.me();
      setUser(me);
    } catch {
      logout();
    } finally {
      setIsLoadingUser(false);
    }
  }, [token, logout]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!token,
        isLoadingUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
