import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const initialized = useRef(false);


    // ==========================================
    // INITIALIZE AUTH
    // ==========================================
    useEffect(() => {

        // Prevent duplicate initialization
        // during React StrictMode development.
        if (initialized.current) {
            return;
        }

        initialized.current = true;


        const initializeAuth = async () => {
            try {
                const storedToken =
                    localStorage.getItem("token");

                const storedUser =
                    localStorage.getItem("user");


                // ==========================================
                // RESTORE USER FROM LOCAL STORAGE
                // ==========================================
                if (storedUser) {
                    try {
                        const parsedUser =
                            JSON.parse(storedUser);

                        setUser(parsedUser);

                    } catch (error) {
                        console.error(
                            "Invalid stored user:",
                            error
                        );

                        localStorage.removeItem(
                            "user"
                        );
                    }
                }


                // ==========================================
                // NO ACCESS TOKEN
                // ==========================================
                if (!storedToken) {
                    setToken(null);
                    setLoading(false);

                    /*
                     * IMPORTANT:
                     *
                     * Do NOT call /auth/me here.
                     *
                     * Otherwise:
                     *
                     * /login
                     * -> /auth/me
                     * -> 401
                     * -> /refresh
                     * -> 401
                     * -> /login
                     * -> LOOP
                     */
                    return;
                }


                // ==========================================
                // RESTORE TOKEN
                // ==========================================
                setToken(storedToken);


                // ==========================================
                // VERIFY CURRENT USER
                // ==========================================
                const response =
                    await api.get("/auth/me");

                const currentUser =
                    response.data?.data?.user;


                if (!currentUser) {
                    throw new Error(
                        "User data not found."
                    );
                }


                // ==========================================
                // UPDATE USER
                // ==========================================
                setUser(currentUser);

                localStorage.setItem(
                    "user",
                    JSON.stringify(currentUser)
                );


                // ==========================================
                // GET LATEST TOKEN
                // ==========================================
                const latestToken =
                    localStorage.getItem("token");

                setToken(latestToken);

            } catch (error) {

                console.error(
                    "Authentication initialization failed:",
                    error.response?.data ||
                    error.message
                );


                /*
                 * The interceptor will already have
                 * attempted token refresh if necessary.
                 *
                 * If authentication is no longer valid,
                 * clear the local state.
                 */
                const currentToken =
                    localStorage.getItem("token");

                const currentUser =
                    localStorage.getItem("user");


                if (!currentToken) {
                    setToken(null);
                }

                if (!currentUser) {
                    setUser(null);
                }

            } finally {
                setLoading(false);
            }
        };


        initializeAuth();

    }, []);


    // ==========================================
    // LOGIN
    // ==========================================
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


    // ==========================================
    // LOGOUT
    // ==========================================
    const logout = async () => {

        try {
            await api.post("/auth/logout");

        } catch (error) {

            console.error(
                "Logout error:",
                error.response?.data ||
                error.message
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