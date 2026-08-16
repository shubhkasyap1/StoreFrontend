import { useEffect, useState } from "react";
import { X, MapPin } from "lucide-react";

import RatingInput from "./RatingInput";
import RatingStars from "./RatingStars";

import {
    createRating,
    updateRating,
} from "../../services/storeApi";

const StoreRatingModal = ({
    store,
    onClose,
    onRatingUpdated,
}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /*
     * Determine whether this user has already
     * rated the selected store.
     */
    const hasExistingRating =
        Number(store?.userRating) > 0;

    /*
     * Load the user's existing rating/comment
     * whenever a different store is selected.
     */
    useEffect(() => {
        if (!store) {
            return;
        }

        setRating(
            Number(store.userRating) || 0
        );

        setComment(
            store.userComment || ""
        );

        setError("");
    }, [store]);

    if (!store) {
        return null;
    }

    /*
     * Submit new rating or update existing rating.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!rating) {
            setError(
                "Please select a rating from 1 to 5."
            );
            return;
        }

        try {
            setLoading(true);

            const ratingData = {
                rating: Number(rating),
                comment: comment.trim(),
            };

            if (hasExistingRating) {
                /*
                 * Existing rating
                 *
                 * PATCH
                 */
                await updateRating(
                    store.id,
                    ratingData
                );
            } else {
                /*
                 * First rating
                 *
                 * POST
                 */
                await createRating(
                    store.id,
                    ratingData
                );
            }

            /*
             * Refresh stores after successful
             * POST/PATCH.
             */
            if (onRatingUpdated) {
                await onRatingUpdated();
            }

            /*
             * Close modal.
             */
            onClose();
        } catch (err) {
            console.error(
                "Rating operation failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Failed to save your rating. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * Close modal when clicking outside.
     */
    const handleBackdropClick = (event) => {
        if (
            event.target === event.currentTarget &&
            !loading
        ) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onMouseDown={handleBackdropClick}
        >
            <div className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* =========================
                    HEADER
                ========================== */}
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                    <div className="min-w-0">
                        <h2 className="truncate text-xl font-semibold text-slate-900">
                            {store.name}
                        </h2>

                        <div className="mt-1.5 flex items-start gap-1.5 text-sm text-slate-500">
                            <MapPin
                                size={15}
                                className="mt-0.5 shrink-0"
                            />

                            <span>
                                {store.address ||
                                    "Address not available"}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close rating dialog"
                        className="ml-4 shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* =========================
                    FORM
                ========================== */}
                <form
                    onSubmit={handleSubmit}
                    className="px-6 py-6"
                >
                    {/* =========================
                        OVERALL RATING
                    ========================== */}
                    <div>
                        <p className="text-sm font-medium text-slate-700">
                            Overall rating
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                            <RatingStars
                                rating={
                                    Number(
                                        store.overallRating
                                    ) || 0
                                }
                                size={20}
                            />

                            <span className="text-sm text-slate-500">
                                {Number(
                                    store.overallRating ||
                                        0
                                ).toFixed(1)}

                                {" ("}

                                {Number(
                                    store.totalRatings
                                ) || 0}

                                {")"}
                            </span>
                        </div>
                    </div>

                    {/* =========================
                        USER RATING
                    ========================== */}
                    <div className="mt-7">
                        <p className="text-sm font-medium text-slate-700">
                            Your rating
                        </p>

                        <div className="mt-3">
                            <RatingInput
                                value={rating}
                                onChange={setRating}
                                disabled={loading}
                                size={30}
                            />
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                            {rating
                                ? `You selected ${rating} out of 5`
                                : "Select a rating from 1 to 5"}
                        </p>
                    </div>

                    {/* =========================
                        COMMENT
                    ========================== */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="store-comment"
                                className="text-sm font-medium text-slate-700"
                            >
                                Comment
                            </label>

                            <span className="text-xs text-slate-400">
                                {comment.length}/500
                            </span>
                        </div>

                        <textarea
                            id="store-comment"
                            value={comment}
                            onChange={(event) =>
                                setComment(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            maxLength={500}
                            rows={4}
                            placeholder="Share your experience with this store..."
                            className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-orange-400/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />
                    </div>

                    {/* =========================
                        EXISTING RATING MESSAGE
                    ========================== */}
                    {hasExistingRating && (
                        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                            <p className="text-sm font-medium text-blue-800">
                                You have already rated this store.
                            </p>

                            <p className="mt-1 text-xs text-blue-600">
                                Your changes will update your
                                existing rating.
                            </p>
                        </div>
                    )}

                    {/* =========================
                        ERROR
                    ========================== */}
                    {error && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* =========================
                        ACTIONS
                    ========================== */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !rating
                            }
                            className="rounded-xl bg-[#213b59] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#172f4b] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Saving..."
                                : hasExistingRating
                                ? "Update rating"
                                : "Submit rating"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StoreRatingModal;