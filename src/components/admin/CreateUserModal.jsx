import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { createAdminUser } from "../../services/adminApi";

const CreateUserModal = ({
    isOpen,
    onClose,
    onUserCreated,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "USER",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        const passwordRegex =
            /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/;

        if (!passwordRegex.test(formData.password)) {
            setError(
                "Password must be 8–16 characters and contain at least one uppercase letter and one special character."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await createAdminUser({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                address: formData.address.trim(),
                role: formData.role,
            });

            onUserCreated(response.data?.user);

            setFormData({
                name: "",
                email: "",
                address: "",
                password: "",
                role: "USER",
            });

            onClose();
        } catch (error) {
            console.error(
                "Create user error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to create user."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="w-full max-w-[640px] rounded-2xl border border-[#dfdcd4] bg-[#faf9f5] shadow-2xl">

                {/* Header */}
                <div className="flex items-start justify-between px-8 pt-7">
                    <div>
                        <h2 className="text-[21px] font-semibold text-[#17263a]">
                            Add a new user
                        </h2>

                        <p className="mt-1 text-[15px] text-[#657084]">
                            Creates a confirmed account with the selected role.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-[#657084] transition hover:bg-[#eeeae2] hover:text-[#17263a]"
                        aria-label="Close"
                    >
                        <X size={21} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="px-8 pb-7 pt-6"
                >
                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label
                            htmlFor="create-name"
                            className="mb-2 block text-[15px] font-medium text-[#17263a]"
                        >
                            Name
                        </label>

                        <input
                            id="create-name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="h-11 w-full rounded-xl border border-[#dedbd3] bg-white px-4 text-[15px] text-[#17263a] shadow-sm outline-none transition focus:border-[#213b59] focus:ring-1 focus:ring-[#213b59]"
                        />
                    </div>

                    {/* Email */}
                    <div className="mt-5">
                        <label
                            htmlFor="create-email"
                            className="mb-2 block text-[15px] font-medium text-[#17263a]"
                        >
                            Email
                        </label>

                        <input
                            id="create-email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="h-11 w-full rounded-xl border border-[#dedbd3] bg-white px-4 text-[15px] text-[#17263a] shadow-sm outline-none transition focus:border-[#213b59] focus:ring-1 focus:ring-[#213b59]"
                        />
                    </div>

                    {/* Address */}
                    <div className="mt-5">
                        <label
                            htmlFor="create-address"
                            className="mb-2 block text-[15px] font-medium text-[#17263a]"
                        >
                            Address
                        </label>

                        <textarea
                            id="create-address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            rows={2}
                            className="w-full resize-none rounded-xl border border-[#dedbd3] bg-white px-4 py-3 text-[15px] text-[#17263a] shadow-sm outline-none transition focus:border-[#213b59] focus:ring-1 focus:ring-[#213b59]"
                        />
                    </div>

                    {/* Password */}
                    <div className="mt-5">
                        <label
                            htmlFor="create-password"
                            className="mb-2 block text-[15px] font-medium text-[#17263a]"
                        >
                            Password
                        </label>

                        <input
                            id="create-password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            className="h-11 w-full rounded-xl border border-[#dedbd3] bg-white px-4 text-[15px] text-[#17263a] shadow-sm outline-none transition focus:border-[#213b59] focus:ring-1 focus:ring-[#213b59]"
                        />

                        <p className="mt-2 text-[13px] text-[#657084]">
                            8–16 characters, one uppercase letter and one
                            special character.
                        </p>
                    </div>

                    {/* Role */}
                    <div className="mt-5">
                        <label
                            htmlFor="create-role"
                            className="mb-2 block text-[15px] font-medium text-[#17263a]"
                        >
                            Role
                        </label>

                        <div className="relative">
                            <select
                                id="create-role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="h-11 w-full appearance-none rounded-xl border border-[#dedbd3] bg-white px-4 pr-10 text-[15px] text-[#17263a] shadow-sm outline-none transition focus:border-[#f2a033] focus:ring-1 focus:ring-[#f2a033]"
                            >
                                <option value="USER">
                                    Normal User
                                </option>

                                <option value="STORE_OWNER">
                                    Store Owner
                                </option>
                            </select>

                            <ChevronDown
                                size={18}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#737b88]"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-5 h-11 w-full rounded-xl bg-[#213b59] text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#192f48] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Creating..."
                            : "Create user"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;