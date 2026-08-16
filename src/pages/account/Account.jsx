import { useState } from "react";
import Header from "../../components/layout/Header";
import { useAuth } from "../../context/AuthContext";
import { updatePassword } from "../../services/accountApi";

const Account = () => {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.currentPassword ||
            !formData.newPassword ||
            !formData.confirmPassword
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        const passwordRegex =
            /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/;

        if (!passwordRegex.test(formData.newPassword)) {
            setError(
                "Password must be 8–16 characters and contain at least one uppercase letter and one special character."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await updatePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            setSuccess(
                response.message ||
                    "Password updated successfully."
            );

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error(
                "Password update error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to update password."
            );
        } finally {
            setLoading(false);
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case "ADMIN":
                return "System Administrator";

            case "STORE_OWNER":
                return "Store Owner";

            case "USER":
                return "Normal User";

            default:
                return role || "-";
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f5]">

            {/* Common Header */}
            <Header />

            <main className="mx-auto max-w-[1055px] px-6 pb-12 pt-10">

                {/* Page heading */}
                <div>
                    <h1 className="text-[28px] font-semibold tracking-tight text-[#17263a]">
                        Your account
                    </h1>

                    <p className="mt-1 text-[15px] text-[#657084]">
                        Details and password.
                    </p>
                </div>

                {/* Account details */}
                <section className="mt-7 max-w-[660px] rounded-2xl border border-[#dfdcd4] bg-white px-6 py-6">
                    <div className="grid grid-cols-[120px_1fr] gap-y-4 text-[15px]">

                        <span className="text-[#5f7189]">
                            Name
                        </span>

                        <span className="text-right font-medium text-[#17263a]">
                            {user?.name || "-"}
                        </span>

                        <span className="text-[#5f7189]">
                            Email
                        </span>

                        <span className="text-right font-medium text-[#17263a]">
                            {user?.email || "-"}
                        </span>

                        <span className="text-[#5f7189]">
                            Address
                        </span>

                        <span className="text-right font-medium text-[#17263a]">
                            {user?.address || "-"}
                        </span>

                        <span className="text-[#5f7189]">
                            Role
                        </span>

                        <span className="text-right font-medium text-[#17263a]">
                            {getRoleLabel(user?.role)}
                        </span>

                    </div>
                </section>

                {/* Update password */}
                <section className="mt-7 max-w-[660px] rounded-2xl border border-[#dfdcd4] bg-white px-6 py-6">

                    <h2 className="text-[18px] font-semibold text-[#17263a]">
                        Update password
                    </h2>

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[14px] text-green-700">
                            {success}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6"
                    >
                        <div>
                            <label
                                htmlFor="currentPassword"
                                className="mb-2 block text-[15px] font-medium text-[#17263a]"
                            >
                                Current password
                            </label>

                            <input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                autoComplete="current-password"
                                className="h-11 w-full rounded-xl border border-[#dedbd3] bg-white px-4 text-[15px] text-[#17263a] outline-none transition focus:border-[#213b59] focus:ring-1 focus:ring-[#213b59]"
                            />
                        </div>

                        <div className="mt-5">
                            <label
                                htmlFor="newPassword"
                                className="mb-2 block text-[15px] font-medium text-[#17263a]"
                            >
                                New password
                            </label>

                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                className="h-11 w-full rounded-xl border border-[#dedbd3] bg-white px-4 text-[15px] text-[#17263a] outline-none transition focus:border-[#213b59] focus:ring-1 focus:ring-[#213b59]"
                            />

                            <p className="mt-2 text-[13px] text-[#657084]">
                                8–16 characters, one uppercase letter
                                and one special character.
                            </p>
                        </div>

                        <div className="mt-5">
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-[15px] font-medium text-[#17263a]"
                            >
                                Confirm password
                            </label>

                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                className="h-11 w-full rounded-xl border border-[#dedbd3] bg-white px-4 text-[15px] text-[#17263a] outline-none transition focus:border-[#213b59] focus:ring-1 focus:ring-[#213b59]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-5 rounded-xl bg-[#213b59] px-5 py-2.5 text-[15px] font-medium text-white shadow-sm transition hover:bg-[#192f48] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Updating..."
                                : "Update password"}
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default Account;