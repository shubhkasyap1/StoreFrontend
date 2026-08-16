import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Header from "../../components/layout/Header";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [isRegister, setIsRegister] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleModeChange = (registerMode) => {
        setIsRegister(registerMode);

        setError("");
        setSuccess("");

        setFormData({
            name: "",
            email: "",
            password: "",
            address: "",
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) {
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // ==========================================
            // REGISTER
            // ==========================================
            if (isRegister) {
                const payload = {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    address: formData.address.trim(),
                };

                const response = await api.post(
                    "/auth/register",
                    payload
                );

                console.log(
                    "REGISTER RESPONSE:",
                    response.data
                );

                setSuccess(
                    response.data?.message ||
                    "Account created successfully. Please login."
                );

                /*
                 * Switch to Login mode.
                 *
                 * Keep email so user doesn't have to type it again.
                 */
                setIsRegister(false);

                setFormData({
                    name: "",
                    email: formData.email.trim(),
                    password: "",
                    address: "",
                });

                return;
            }

            // ==========================================
            // LOGIN
            // ==========================================
            const payload = {
                email: formData.email.trim(),
                password: formData.password,
            };

            const response = await api.post(
                "/auth/login",
                payload
            );

            console.log(
                "LOGIN RESPONSE:",
                response.data
            );

            const data = response.data?.data;

            if (!data) {
                setError(
                    "Invalid response received from server."
                );
                return;
            }

            const { user, accessToken } = data;

            if (!user || !accessToken) {
                console.error(
                    "Invalid login response:",
                    response.data
                );

                setError(
                    "Invalid response received from server."
                );

                return;
            }

            // Save authentication state
            login(user, accessToken);

            // ==========================================
            // REDIRECT BASED ON ROLE
            // ==========================================
            switch (user.role) {
                case "ADMIN":
                    navigate("/admin", {
                        replace: true,
                    });
                    break;

                case "STORE_OWNER":
                    navigate("/owner", {
                        replace: true,
                    });
                    break;

                case "USER":
                    navigate("/user", {
                        replace: true,
                    });
                    break;

                default:
                    console.error(
                        "Unknown role:",
                        user.role
                    );

                    setError(
                        "Invalid user role."
                    );
            }
        } catch (error) {
            console.error(
                isRegister
                    ? "REGISTER ERROR:"
                    : "LOGIN ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                (isRegister
                    ? "Registration failed."
                    : "Login failed.");

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f6ee]">

            {/* Simple Storefront Header */}
            <Header />

            {/* Auth Content */}
            <main className="flex min-h-[calc(100vh-68px)] items-start justify-center px-4 py-12">

                <div className="w-full max-w-md">

                    {/* Auth Card */}
                    <div className="rounded-2xl border border-[#e1ded5] bg-white p-8 shadow-sm">

                        {/* Login / Signup Tabs */}
                        <div className="mb-8 flex rounded-xl bg-[#f1efe8] p-1">

                            {/* Login */}
                            <button
                                type="button"
                                onClick={() =>
                                    handleModeChange(false)
                                }
                                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                    !isRegister
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                Log in
                            </button>

                            {/* Sign up */}
                            <button
                                type="button"
                                onClick={() =>
                                    handleModeChange(true)
                                }
                                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                    isRegister
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                Sign up
                            </button>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
                                {success}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* =================================
                                Name
                            ================================= */}
                            {isRegister && (
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-medium text-slate-900"
                                    >
                                        Name
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        minLength={2}
                                        maxLength={60}
                                        autoComplete="name"
                                        placeholder="Shubham Kumar"
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                                    />

                                    <p className="mt-2 text-sm text-slate-500">
                                        Between 2 and 60 characters.
                                    </p>
                                </div>
                            )}

                            {/* =================================
                                Email
                            ================================= */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-slate-900"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    placeholder="shubhkasyap1@gmail.com"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                                />
                            </div>

                            {/* =================================
                                Address
                            ================================= */}
                            {isRegister && (
                                <div>
                                    <label
                                        htmlFor="address"
                                        className="mb-2 block text-sm font-medium text-slate-900"
                                    >
                                        Address
                                    </label>

                                    <textarea
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        autoComplete="street-address"
                                        placeholder="Delhi"
                                        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                                    />
                                </div>
                            )}

                            {/* =================================
                                Password
                            ================================= */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-slate-900"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                    maxLength={16}
                                    autoComplete={
                                        isRegister
                                            ? "new-password"
                                            : "current-password"
                                    }
                                    placeholder="••••••••••••"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                                />

                                {isRegister && (
                                    <p className="mt-2 text-sm text-slate-500">
                                        8–16 characters, one uppercase
                                        letter and one special character.
                                    </p>
                                )}
                            </div>

                            {/* =================================
                                Submit
                            ================================= */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-[#243b5a] px-4 py-3 font-semibold text-white transition hover:bg-[#1d304a] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? isRegister
                                        ? "Creating account..."
                                        : "Logging in..."
                                    : isRegister
                                        ? "Create account"
                                        : "Log in"}
                            </button>

                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;