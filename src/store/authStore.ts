
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the shape of the user object
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string; // optional profile image
}

// Define the structure of the auth state
interface AuthState {
  user: User | null;
  token: string | null; 
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

// Create the Zustand store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,

      // Set authentication data after login
      setAuth: (user, token) => {
        // Store token manually in localStorage (optional redundancy)
        localStorage.setItem("token", token);

        // Update Zustand state
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      // Clear authentication data on logout
      logout: () => {
        // Remove stored values from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Reset Zustand state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage", 
    },
  ),
);
