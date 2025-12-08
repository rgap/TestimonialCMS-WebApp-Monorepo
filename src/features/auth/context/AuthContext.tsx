"use client";

import { getApiUrl, projectId, publicAnonKey } from "@/lib/supabase/info";
import { createClient } from "@supabase/supabase-js";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from server
  const fetchUser = async (accessToken: string): Promise<User | null> => {
    try {
      const response = await fetch(getApiUrl("/auth/user"), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log("Failed to fetch user data");
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a stored access token
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
          // Verify the token is still valid by fetching user data
          const userData = await fetchUser(accessToken);

          if (userData) {
            setUser(userData);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log(`Attempting login for: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error(`Supabase auth error: ${error.message}`, error);
        throw new Error(error.message);
      }

      if (!data.session) {
        console.error("No session returned from Supabase");
        throw new Error("No session returned");
      }

      console.log(`Login successful for: ${email}`);

      // Store tokens
      localStorage.setItem("access_token", data.session.access_token);
      localStorage.setItem("refresh_token", data.session.refresh_token);

      // Fetch user data from our server
      const userData = await fetchUser(data.session.access_token);

      if (!userData) {
        throw new Error("Failed to fetch user data");
      }

      setUser(userData);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      console.log(`Attempting signup for: ${email}`);

      const response = await fetch(getApiUrl("/auth/signup"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      console.log(`Signup response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Signup error response:", errorData);
        throw new Error(errorData.error || "Error al crear cuenta");
      }

      const successData = await response.json();
      console.log("Signup successful:", successData);

      // Wait a moment for the user to be fully created in Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // After successful signup, login
      console.log("Attempting auto-login after signup...");
      await login(email, password);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const userData = await fetchUser(accessToken);
      if (userData) {
        setUser(userData);
      }
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
