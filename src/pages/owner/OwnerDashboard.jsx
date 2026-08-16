import { useEffect, useState } from "react";
import {
    ArrowUp,
    ArrowUpDown,
    X,
    User,
    Mail,
    Star,
    Store,
    Calendar,
} from "lucide-react";

import { getOwnerDashboard } from "../../services/ownerApi";
import Header from "../../components/layout/Header";

const RatingStars = ({ rating, size = 20 }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className="leading-none"
                    style={{
                        fontSize: `${size}px`,
                        color: star <= rating ? "#f59e0b" : "#cbd5e1",
                    }}
                >
                    {star <= rating ? "★" : "☆"}
                </span>
            ))}
        </div>
    );
};

const OwnerDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    // Selected rating/user for details modal
    const [selectedRating, setSelectedRating] = useState(null);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getOwnerDashboard({
                page: 1,
                limit: 10,
                sortBy,
                sortOrder,
            });

            if (response.success) {
                setDashboard(response.data);
            } else {
                setError("Unable to load dashboard.");
            }
        } catch (err) {
            console.error("Owner dashboard error:", err);

            setError(
                err?.response?.data?.message ||
                    "Failed to load owner dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, [sortBy, sortOrder]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    // Close modal with Escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setSelectedRating(null);
            }
        };

        if (selectedRating) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [selectedRating]);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-70px)] bg-[#faf9f5]">
                <Header />

                <div className="mx-auto max-w-[1060px] px-6 py-10">
                    <div className="animate-pulse">
                        <div className="h-8 w-72 rounded bg-slate-200" />

                        <div className="mt-3 h-5 w-48 rounded bg-slate-200" />

                        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-36 rounded-2xl border border-slate-200 bg-white"
                                />
                            ))}
                        </div>

                        <div className="mt-7 h-52 rounded-2xl border border-slate-200 bg-white" />

                        <div className="mt-7 h-72 rounded-2xl border border-slate-200 bg-white" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-70px)] bg-[#faf9f5]">
                <Header />

                <div className="mx-auto max-w-[1060px] px-6 py-10">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                        <h2 className="text-lg font-semibold text-red-800">
                            Something went wrong
                        </h2>

                        <p className="mt-2 text-sm text-red-600">
                            {error}
                        </p>

                        <button
                            onClick={fetchDashboard}
                            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!dashboard) {
        return null;
    }

    const {
        stores = [],
        summary = {},
        ratings = [],
    } = dashboard;

    const store = stores[0];

    return (
        <div className="min-h-[calc(100vh-70px)] bg-[#faf9f5]">
            <Header />

            <main className="mx-auto max-w-[1060px] px-6 py-10">
                {/* Header */}
                <div>
                    <h1 className="text-[28px] font-semibold tracking-tight text-[#10243b]">
                        Store owner dashboard
                    </h1>

                    <p className="mt-1 text-[16px] text-slate-500">
                        {store?.name || "Your Store"}
                    </p>

                    {store?.address && (
                        <p className="mt-1 text-sm text-slate-400">
                            {store.address}
                        </p>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
                    {/* Average Rating */}
                    <div className="rounded-2xl border border-[#dedbd3] bg-white px-6 py-6">
                        <p className="text-[13px] font-medium uppercase tracking-wide text-slate-500">
                            Average Rating
                        </p>

                        <p className="mt-2 text-[34px] font-semibold leading-none text-[#10243b]">
                            {Number(summary.averageRating || 0).toFixed(2)}
                        </p>

                        <div className="mt-3">
                            <RatingStars
                                rating={Math.round(
                                    Number(summary.averageRating || 0)
                                )}
                                size={22}
                            />
                        </div>
                    </div>

                    {/* Total Ratings */}
                    <div className="rounded-2xl border border-[#dedbd3] bg-white px-6 py-6">
                        <p className="text-[13px] font-medium uppercase tracking-wide text-slate-500">
                            Total Ratings
                        </p>

                        <p className="mt-2 text-[34px] font-semibold leading-none text-[#10243b]">
                            {summary.totalRatings || 0}
                        </p>
                    </div>

                    {/* Stores Owned */}
                    <div className="rounded-2xl border border-[#dedbd3] bg-white px-6 py-6">
                        <p className="text-[13px] font-medium uppercase tracking-wide text-slate-500">
                            Stores Owned
                        </p>

                        <p className="mt-2 text-[34px] font-semibold leading-none text-[#10243b]">
                            {summary.totalStores || stores.length}
                        </p>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="mt-7 rounded-2xl border border-[#dedbd3] bg-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-[#10243b]">
                                Rating distribution
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Overview of ratings received by your store
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-5 gap-3">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count =
                                summary.ratingDistribution?.[rating] || 0;

                            return (
                                <div
                                    key={rating}
                                    className="rounded-xl bg-[#faf9f5] p-4 text-center"
                                >
                                    <div className="flex justify-center">
                                        <RatingStars
                                            rating={rating}
                                            size={17}
                                        />
                                    </div>

                                    <p className="mt-2 text-xl font-semibold text-[#10243b]">
                                        {count}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {rating} star
                                        {rating !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Ratings Table */}
                <div className="mt-7 overflow-hidden rounded-2xl border border-[#dedbd3] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] border-collapse">
                            <thead>
                                <tr className="border-b border-[#dedbd3]">
                                    {/* Customer */}
                                    <th className="px-3 py-4 text-left text-[15px] font-medium text-[#51627a]">
                                        <button
                                            onClick={() =>
                                                handleSort("user.name")
                                            }
                                            className="flex items-center gap-1"
                                        >
                                            Customer

                                            {sortBy === "user.name" ? (
                                                <ArrowUp
                                                    size={15}
                                                    className={
                                                        sortOrder === "desc"
                                                            ? "rotate-180"
                                                            : ""
                                                    }
                                                />
                                            ) : (
                                                <ArrowUpDown
                                                    size={15}
                                                    className="text-slate-300"
                                                />
                                            )}
                                        </button>
                                    </th>

                                    {/* Email */}
                                    <th className="px-3 py-4 text-left text-[15px] font-medium text-[#51627a]">
                                        <button
                                            onClick={() =>
                                                handleSort("user.email")
                                            }
                                            className="flex items-center gap-1"
                                        >
                                            Email

                                            {sortBy === "user.email" ? (
                                                <ArrowUp
                                                    size={15}
                                                    className={
                                                        sortOrder === "desc"
                                                            ? "rotate-180"
                                                            : ""
                                                    }
                                                />
                                            ) : (
                                                <ArrowUpDown
                                                    size={15}
                                                    className="text-slate-300"
                                                />
                                            )}
                                        </button>
                                    </th>

                                    {/* Rating */}
                                    <th className="px-3 py-4 text-left text-[15px] font-medium text-[#51627a]">
                                        <button
                                            onClick={() =>
                                                handleSort("rating")
                                            }
                                            className="flex items-center gap-1"
                                        >
                                            Rating

                                            {sortBy === "rating" ? (
                                                <ArrowUp
                                                    size={15}
                                                    className={
                                                        sortOrder === "desc"
                                                            ? "rotate-180"
                                                            : ""
                                                    }
                                                />
                                            ) : (
                                                <ArrowUpDown
                                                    size={15}
                                                    className="text-slate-300"
                                                />
                                            )}
                                        </button>
                                    </th>

                                    {/* Submitted */}
                                    <th className="px-3 py-4 text-left text-[15px] font-medium text-[#51627a]">
                                        <button
                                            onClick={() =>
                                                handleSort("createdAt")
                                            }
                                            className="flex items-center gap-1"
                                        >
                                            Submitted

                                            {sortBy === "createdAt" ? (
                                                <ArrowUp
                                                    size={15}
                                                    className={
                                                        sortOrder === "desc"
                                                            ? "rotate-180"
                                                            : ""
                                                    }
                                                />
                                            ) : (
                                                <ArrowUpDown
                                                    size={15}
                                                    className="text-slate-300"
                                                />
                                            )}
                                        </button>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {ratings.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-12 text-center text-sm text-slate-500"
                                        >
                                            No ratings received yet.
                                        </td>
                                    </tr>
                                ) : (
                                    ratings.map((rating) => (
                                        <tr
                                            key={rating.id}
                                            onClick={() =>
                                                setSelectedRating(rating)
                                            }
                                            className="group cursor-pointer border-b border-[#e8e5df] transition hover:bg-[#faf9f5] last:border-b-0"
                                        >
                                            {/* Customer */}
                                            <td className="px-3 py-3.5">
                                                <p className="font-medium text-[#10243b] transition group-hover:text-blue-600">
                                                    {rating.user?.name ||
                                                        "Unknown User"}
                                                </p>

                                                {rating.comment && (
                                                    <p className="mt-1 max-w-[280px] truncate text-xs text-slate-400">
                                                        {rating.comment}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Email */}
                                            <td className="px-3 py-3.5 text-[15px] text-[#53657d]">
                                                {rating.user?.email || "-"}
                                            </td>

                                            {/* Rating */}
                                            <td className="px-3 py-3.5">
                                                <RatingStars
                                                    rating={rating.rating}
                                                    size={20}
                                                />
                                            </td>

                                            {/* Submitted */}
                                            <td className="px-3 py-3.5 text-[15px] text-[#53657d]">
                                                {new Date(
                                                    rating.createdAt
                                                ).toLocaleDateString("en-GB")}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer info */}
                <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                    <p>
                        Showing {ratings.length} of{" "}
                        {dashboard.pagination?.total || ratings.length}{" "}
                        ratings
                    </p>

                    {dashboard.pagination?.totalPages > 1 && (
                        <p>
                            Page {dashboard.pagination.page} of{" "}
                            {dashboard.pagination.totalPages}
                        </p>
                    )}
                </div>
            </main>

            {/* ========================================================= */}
            {/* USER / RATING DETAILS MODAL */}
            {/* ========================================================= */}

            {selectedRating && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedRating(null)}
                >
                    <div
                        className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#dedbd3] bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-[#e8e5df] px-6 py-5">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Customer details
                                </p>

                                <h2 className="mt-1 text-xl font-semibold text-[#10243b]">
                                    {selectedRating.user?.name ||
                                        "Unknown User"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedRating(null)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
                            <div className="space-y-4">
                                {/* User */}
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                        <User size={18} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                            Name
                                        </p>

                                        <p className="mt-1 font-medium text-[#10243b]">
                                            {selectedRating.user?.name || "-"}
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                        <Mail size={18} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                            Email
                                        </p>

                                        <p className="mt-1 break-all text-[#53657d]">
                                            {selectedRating.user?.email || "-"}
                                        </p>
                                    </div>
                                </div>

                        

                                {/* Store */}
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                        <Store size={18} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                            Store
                                        </p>

                                        <p className="mt-1 font-medium text-[#10243b]">
                                            {selectedRating.store?.name ||
                                                store?.name ||
                                                "-"}
                                        </p>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                                        <Star size={18} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                            Rating
                                        </p>

                                        <div className="mt-1 flex items-center gap-3">
                                            <RatingStars
                                                rating={
                                                    selectedRating.rating
                                                }
                                                size={20}
                                            />

                                            <span className="text-sm font-medium text-[#10243b]">
                                                {selectedRating.rating}/5
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Comment */}
                                <div className="rounded-xl bg-[#faf9f5] p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Comment
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#53657d]">
                                        {selectedRating.comment ||
                                            "No comment provided."}
                                    </p>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Submitted */}
                                    <div className="rounded-xl border border-[#e8e5df] p-4">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar size={15} />

                                            <p className="text-xs font-medium uppercase tracking-wide">
                                                Submitted
                                            </p>
                                        </div>

                                        <p className="mt-2 text-sm font-medium text-[#10243b]">
                                            {selectedRating.createdAt
                                                ? new Date(
                                                      selectedRating.createdAt
                                                  ).toLocaleString("en-IN", {
                                                      dateStyle: "medium",
                                                      timeStyle: "short",
                                                  })
                                                : "-"}
                                        </p>
                                    </div>

                                    {/* Updated */}
                                    <div className="rounded-xl border border-[#e8e5df] p-4">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar size={15} />

                                            <p className="text-xs font-medium uppercase tracking-wide">
                                                Updated
                                            </p>
                                        </div>

                                        <p className="mt-2 text-sm font-medium text-[#10243b]">
                                            {selectedRating.updatedAt
                                                ? new Date(
                                                      selectedRating.updatedAt
                                                  ).toLocaleString("en-IN", {
                                                      dateStyle: "medium",
                                                      timeStyle: "short",
                                                  })
                                                : "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end border-t border-[#e8e5df] bg-[#faf9f5] px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setSelectedRating(null)}
                                className="rounded-lg bg-[#10243b] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1b3553]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;