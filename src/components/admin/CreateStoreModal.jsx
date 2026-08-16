import { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";

import { createStore } from "../../services/storeApi";
import { getAdminUsers } from "../../services/adminApi";

const CreateStoreModal = ({
    isOpen,
    onClose,
    onStoreCreated,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        ownerId: "",
    });

    const [owners, setOwners] = useState([]);
    const [loadingOwners, setLoadingOwners] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        const loadOwners = async () => {
            try {
                setLoadingOwners(true);
                setError("");

                const response = await getAdminUsers({
                    role: "STORE_OWNER",
                    page: 1,
                    limit: 100,
                });

                setOwners(response.data?.users || []);
            } catch (error) {
                console.error(
                    "Store owners error:",
                    error.response?.data || error.message
                );

                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load store owners."
                );
            } finally {
                setLoadingOwners(false);
            }
        };

        loadOwners();
    }, [isOpen]);

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

        try {
            setLoading(true);

            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                address: formData.address.trim(),
            };

            // Owner is optional.
            if (formData.ownerId) {
                payload.ownerId = formData.ownerId;
            }

            const response = await createStore(payload);

            onStoreCreated(response.data?.store);

            setFormData({
                name: "",
                email: "",
                address: "",
                ownerId: "",
            });

            onClose();
        } catch (error) {
            console.error(
                "Create store error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to create store."
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
                            Add a new store
                        </h2>

                        <p className="mt-1 text-[15px] text-[#657084]">
                            Optionally assign an existing store owner.
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

                    {/* Store name */}
                    <div>
                        <label
                            htmlFor="store-name"
                            className="mb-2 block text-[15px] font-medium text-[#17263a]"
                        >
                            Store name
                        </label>

                        <input
                            id="store-name"
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
                            htmlFor="store-email"
                            className="mb-2 block text-[15px] font-medium text-[#17263a]"
                        >
                            Email
                        </label>

                        <input
                            id="store-email"
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
                            htmlFor="store-address"
                            className="mb-2 block text-[15px] font-medium text-[#17263a]"
                        >
                            Address
                        </label>

                        <textarea
                            id="store-address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            rows={2}
                            className="w-full resize-none rounded-xl border border-[#dedbd3] bg-white px-4 py-3 text-[15px] text-[#17263a] shadow-sm outline-none transition focus:border-[#213b59] focus:ring-1 focus:ring-[#213b59]"
                        />
                    </div>

                    {/* Owner */}
                    <div className="mt-5">
                        <label
                            htmlFor="store-owner"
                            className="mb-2 block text-[15px] font-medium text-[#17263a]"
                        >
                            Owner
                        </label>

                        <div className="relative">
                            <select
                                id="store-owner"
                                name="ownerId"
                                value={formData.ownerId}
                                onChange={handleChange}
                                disabled={loadingOwners}
                                className="h-11 w-full appearance-none rounded-xl border border-[#dedbd3] bg-white px-4 pr-10 text-[15px] text-[#17263a] shadow-sm outline-none transition focus:border-[#f2a033] focus:ring-1 focus:ring-[#f2a033] disabled:cursor-not-allowed disabled:bg-[#f1efe9]"
                            >
                                <option value="">
                                    {loadingOwners
                                        ? "Loading owners..."
                                        : "No owner"}
                                </option>

                                {owners.map((owner) => (
                                    <option
                                        key={owner.id}
                                        value={owner.id}
                                    >
                                        {owner.name} — {owner.email}
                                    </option>
                                ))}
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
                            : "Create store"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateStoreModal;