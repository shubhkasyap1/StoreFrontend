import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        setLoading(true);
        setError("");

        const response = await api.post("/auth/login", {
            email: formData.email.trim(),
            password: formData.password,
        });

        console.log("LOGIN RESPONSE:", response.data);

        const { user, accessToken } = response.data.data;

        if (!user || !accessToken) {
            console.error(
                "Invalid login response:",
                response.data
            );

            setError("Invalid response received from server.");
            return;
        }

        login(user, accessToken);

        switch (user.role) {
            case "ADMIN":
                navigate("/admin", { replace: true });
                break;

            case "STORE_OWNER":
                navigate("/owner", { replace: true });
                break;

            case "USER":
                navigate("/user", { replace: true });
                break;

            default:
                console.error("Unknown role:", user.role);
                setError("Invalid user role.");
        }
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        console.error(
            "SERVER RESPONSE:",
            error.response?.data
        );

        setError(
            error.response?.data?.message ||
            error.message ||
            "Login failed."
        );
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

                <h1 className="text-3xl font-bold text-slate-900">
                    Login
                </h1>

                <p className="mt-2 text-slate-500">
                    Sign in to your account
                </p>

                {error && (
                    <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="admin@storerating.com"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;