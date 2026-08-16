import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===============================
// RESPONSE INTERCEPTOR
// ===============================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // No response / no request
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    // ===============================
    // HANDLE ACCESS TOKEN EXPIRATION
    // ===============================
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/logout")
    ) {
      originalRequest._retry = true;

      try {
        console.log(
          "Access token expired. Trying refresh..."
        );

        const response =
          await api.post("/auth/refresh");

        const newAccessToken =
          response.data?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error(
            "No access token received from refresh endpoint"
          );
        }

        // Save new access token
        localStorage.setItem(
          "token",
          newAccessToken
        );

        console.log(
          "Access token refreshed successfully"
        );

        // Retry original request
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization:
            `Bearer ${newAccessToken}`,
        };

        return api(originalRequest);
      } catch (refreshError) {
        console.error(
          "Refresh token failed:",
          refreshError.response?.data ||
            refreshError.message
        );

        // Refresh token is invalid/expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.replace("/login");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;