import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      // Restore user immediately from localStorage
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Invalid stored user:", error);
          localStorage.removeItem("user");
        }
      }

      if (storedToken) {
        setToken(storedToken);
      }

      /*
       * No token at all.
       *
       * We could still have a refresh-token cookie,
       * so try /auth/me anyway.
       */
      try {
        const response = await api.get("/auth/me");

        const currentUser = response.data.data.user;

        if (!currentUser) {
          throw new Error("User data not found");
        }

        setUser(currentUser);

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );

        // The interceptor may have refreshed the token.
        const latestToken =
          localStorage.getItem("token");

        setToken(latestToken);
      } catch (error) {
        console.error(
          "Authentication initialization failed:",
          error.response?.data || error.message
        );

        /*
         * IMPORTANT:
         *
         * Don't immediately clear authentication here.
         *
         * If we already have a stored token/user,
         * keep them temporarily. This prevents a
         * network/server error from logging the user out.
         */

        const currentToken =
          localStorage.getItem("token");

        const currentUser =
          localStorage.getItem("user");

        if (!currentToken || !currentUser) {
          setToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, accessToken) => {
    localStorage.setItem(
      "token",
      accessToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setToken(accessToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data || error.message
      );
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);