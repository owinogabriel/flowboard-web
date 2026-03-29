import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "@/lib/firebase";
import api from "@/lib/api";

export const authService = {
  // Register with Email + Password
  register: async (name: string, email: string, password: string) => {
    // Step 1 - Create in Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const firebaseUser = userCredential.user;

    // Step 2 - Hit our existing register endpoint
    // Use firebase uid as password since Firebase handles real auth
    const response = await api.post("/api/auth/register", {
      name,
      email,
      password: firebaseUser.uid,
    });

    return response.data;
  },

  // Login with Email + Password
  login: async (email: string, password: string) => {
    // Step 1 - Login with Firebase (validates password)
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const firebaseUser = userCredential.user;

    // Step 2 - Hit our existing login endpoint
    // Use firebase uid as password
    const response = await api.post("/api/auth/login", {
      email,
      password: firebaseUser.uid,
    });

    return response.data;
  },

  // Google Login
  googleLogin: async () => {
    // Step 1 - Google popup via Firebase
    const userCredential = await signInWithPopup(auth, googleProvider);
    const firebaseUser = userCredential.user;

    // Step 2 - Check if user exists in our backend
    try {
      // Try login first (existing user)
      const response = await api.post("/api/auth/login", {
        email: firebaseUser.email,
        password: firebaseUser.uid,
      });
      return response.data;
    } catch {
      // User doesn't exist — register them
      const response = await api.post("/api/auth/register", {
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
        email: firebaseUser.email,
        password: firebaseUser.uid,
      });
      return response.data;
    }
  },

  // Logout
  logout: async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current user from backend
  getMe: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },
};
