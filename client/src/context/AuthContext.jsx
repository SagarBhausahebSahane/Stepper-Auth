import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";
import { securePost, secureGet } from "../api/secureApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      secureGet("/user/profile")
        .then((data) => setUser(data.user))
        .catch(() => {
          localStorage.removeItem("accessToken");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await securePost("/auth/login", { email, password });
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await securePost("/auth/register", { name, email, password });
    return data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const markProfileComplete = (profileData) => {
    setUser((prev) => ({
      ...prev,
      profileCompleted: true,
      profileData,
    }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, markProfileComplete }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
