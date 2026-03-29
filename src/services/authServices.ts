import api from "@/lib/api";

// Data required for user registration
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Data required for user login
export interface LoginData {
  email: string;
  password: string;
}

// Auth service: handles all API calls related to authentication
export const authService = {
  // Register a new user
  register: async (data: RegisterData) => {
    // Send POST request to backend with user details
    const response = await api.post("/api/auth/register", data);

    // Return only the response data 
    return response.data;
  },

  // Login existing user
  login: async (data: LoginData) => {
    // Send POST request with email & password
    const response = await api.post("/api/auth/login", data);

    // Expected to return token + user info from backend
    return response.data;
  },

  // Get currently authenticated user
  getMe: async () => {
    // Send GET request to fetch current user info (requires auth token in headers)
    const response = await api.get("/api/auth/me");

    // Returns current user info
    return response.data;
  },
};
