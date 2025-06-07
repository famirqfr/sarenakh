"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Loader from "@/components/common/loader";

interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  role: "SUPERADMIN" | "ADMIN" | "MENTOR" | "CASHIER";
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/api/auth/me");
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  if (loading) return <Loader />;

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
