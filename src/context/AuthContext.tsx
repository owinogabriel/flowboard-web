"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged, User } from "@/lib/firebase";
import { authService } from "@/services/authServices";
import { useRouter } from "next/navigation";

interface BackendUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  firebaseUser: User | null;
  user: BackendUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: BackendUser, token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<BackendUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);

        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setAuth = (backendUser: BackendUser, backendToken: string) => {
    setUser(backendUser);
    setToken(backendToken);
    localStorage.setItem("token", backendToken);
    localStorage.setItem("user", JSON.stringify(backendUser));
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    setFirebaseUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
