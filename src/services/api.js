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

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================
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
    (error) => Promise.reject(error)
);


// ==========================================
// REFRESH STATE
// ==========================================

let isRefreshing = false;

let refreshSubscribers = [];

const subscribeToRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const notifyRefreshSubscribers = (newToken) => {
    refreshSubscribers.forEach((callback) => {
        callback(newToken);
    });

    refreshSubscribers = [];
};


// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (!error.response || !originalRequest) {
            return Promise.reject(error);
        }

        const status = error.response.status;

        const requestUrl = originalRequest.url || "";

        // ==========================================
        // NEVER REFRESH THESE REQUESTS
        // ==========================================
        const isLoginRequest =
            requestUrl.includes("/auth/login");

        const isRegisterRequest =
            requestUrl.includes("/auth/register");

        const isRefreshRequest =
            requestUrl.includes("/auth/refresh");

        const isLogoutRequest =
            requestUrl.includes("/auth/logout");

        if (
            isLoginRequest ||
            isRegisterRequest ||
            isRefreshRequest ||
            isLogoutRequest
        ) {
            return Promise.reject(error);
        }


        // ==========================================
        // ONLY HANDLE 401
        // ==========================================
        if (
            status !== 401 ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }


        // ==========================================
        // IF THERE IS NO ACCESS TOKEN
        // DON'T TRY REFRESH
        // ==========================================
        const currentToken =
            localStorage.getItem("token");

        if (!currentToken) {
            return Promise.reject(error);
        }


        originalRequest._retry = true;


        // ==========================================
        // REFRESH ALREADY IN PROGRESS
        // ==========================================
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                subscribeToRefresh((newToken) => {
                    if (!newToken) {
                        reject(error);
                        return;
                    }

                    originalRequest.headers = {
                        ...originalRequest.headers,
                        Authorization:
                            `Bearer ${newToken}`,
                    };

                    resolve(api(originalRequest));
                });
            });
        }


        // ==========================================
        // START REFRESH
        // ==========================================
        isRefreshing = true;

        try {
            console.log(
                "Access token expired. Trying refresh..."
            );

            /*
             * IMPORTANT:
             *
             * Use a separate axios request here.
             *
             * Don't use `api.post()` because that request
             * itself has the response interceptor.
             */
            const refreshResponse = await axios.post(
                `${
                    import.meta.env.VITE_API_URL ||
                    "http://localhost:5000/api"
                }/auth/refresh`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            const newAccessToken =
                refreshResponse.data?.data?.accessToken;

            if (!newAccessToken) {
                throw new Error(
                    "No access token received from refresh endpoint."
                );
            }


            // ==========================================
            // SAVE NEW TOKEN
            // ==========================================
            localStorage.setItem(
                "token",
                newAccessToken
            );


            console.log(
                "Access token refreshed successfully."
            );


            // ==========================================
            // RESOLVE WAITING REQUESTS
            // ==========================================
            notifyRefreshSubscribers(
                newAccessToken
            );


            // ==========================================
            // RETRY ORIGINAL REQUEST
            // ==========================================
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


            // Notify waiting requests that refresh failed
            notifyRefreshSubscribers(null);


            // Remove invalid authentication state
            localStorage.removeItem("token");
            localStorage.removeItem("user");


            /*
             * Only redirect if we are NOT already on /login.
             *
             * This prevents:
             *
             * /login -> refresh -> /login -> refresh -> ...
             */
            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }


            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
    }
);

export default api;