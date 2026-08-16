import { useState } from "react";
import {
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
} from "lucide-react";

import StoreRatingModal from "./StoreRatingModal";
import RatingStars from "./RatingStars";

const StoreTable = ({
    stores = [],
    loading = false,
    onRatingUpdated,
}) => {
    const [selectedStore, setSelectedStore] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection((current) =>
                current === "asc" ? "desc" : "asc"
            );
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const sortedStores = [...stores].sort((a, b) => {
        if (!sortField) {
            return 0;
        }

        let first = a?.[sortField];
        let second = b?.[sortField];

        // Keep unrated stores at the beginning when
        // sorting by rating.
        if (
            sortField === "userRating" ||
            sortField === "overallRating"
        ) {
            first = Number(first) || 0;
            second = Number(second) || 0;
        }

        if (typeof first === "string") {
            first = first.toLowerCase();
        }

        if (typeof second === "string") {
            second = second.toLowerCase();
        }

        if (first < second) {
            return sortDirection === "asc" ? -1 : 1;
        }

        if (first > second) {
            return sortDirection === "asc" ? 1 : -1;
        }

        return 0;
    });

    const SortIcon = ({ field }) => {
        if (sortField !== field) {
            return (
                <ArrowUpDown
                    size={16}
                    strokeWidth={1.7}
                    className="text-[#8ca0bb]"
                />
            );
        }

        return sortDirection === "asc" ? (
            <ArrowUp
                size={16}
                strokeWidth={1.8}
                className="text-[#7d91ad]"
            />
        ) : (
            <ArrowDown
                size={16}
                strokeWidth={1.8}
                className="text-[#7d91ad]"
            />
        );
    };

    const handleRowClick = (store) => {
        setSelectedStore(store);
    };

    const handleModalClose = () => {
        setSelectedStore(null);
    };

    if (loading) {
        return (
            <div className="rounded-[20px] border border-[#dedbd4] bg-white p-10 text-center text-slate-500">
                Loading stores...
            </div>
        );
    }

    if (!stores.length) {
        return (
            <div className="rounded-[20px] border border-[#dedbd4] bg-white p-10 text-center text-slate-500">
                No stores found.
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-[20px] border border-[#dedbd4] bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] table-fixed border-collapse">
                        <colgroup>
                            <col className="w-[20%]" />
                            <col className="w-[30%]" />
                            <col className="w-[25%]" />
                            <col className="w-[25%]" />
                        </colgroup>

                        {/* Header */}
                        <thead>
                            <tr className="border-b border-[#e1ded8]">
                                <th className="px-4 py-4 text-left font-normal">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSort("name")
                                        }
                                        className="flex items-center gap-2 text-[16px] font-medium text-[#526784]"
                                    >
                                        <span>Store</span>
                                        <SortIcon field="name" />
                                    </button>
                                </th>

                                <th className="px-4 py-4 text-left font-normal">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSort("address")
                                        }
                                        className="flex items-center gap-2 text-[16px] font-medium text-[#526784]"
                                    >
                                        <span>Address</span>
                                        <SortIcon field="address" />
                                    </button>
                                </th>

                                <th className="px-4 py-4 text-left font-normal">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSort(
                                                "overallRating"
                                            )
                                        }
                                        className="flex items-center gap-2 text-[16px] font-medium text-[#526784]"
                                    >
                                        <span>
                                            Overall rating
                                        </span>
                                        <SortIcon
                                            field="overallRating"
                                        />
                                    </button>
                                </th>

                                <th className="px-4 py-4 text-left font-normal">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSort(
                                                "userRating"
                                            )
                                        }
                                        className="flex items-center gap-2 text-[16px] font-medium text-[#526784]"
                                    >
                                        <span>
                                            Your rating
                                        </span>
                                        <SortIcon
                                            field="userRating"
                                        />
                                    </button>
                                </th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody>
                            {sortedStores.map((store) => {
                                const overallRating =
                                    Number(
                                        store.overallRating
                                    ) || 0;

                                const userRating =
                                    Number(
                                        store.userRating
                                    ) || 0;

                                const totalRatings =
                                    Number(
                                        store.totalRatings
                                    ) || 0;

                                return (
                                    <tr
                                        key={store.id}
                                        onClick={() =>
                                            handleRowClick(
                                                store
                                            )
                                        }
                                        className="cursor-pointer border-b border-[#e8e5df] transition-colors last:border-b-0 hover:bg-[#faf9f6]"
                                    >
                                        {/* Store */}
                                        <td className="px-4 py-5">
                                            <span className="text-[16px] font-semibold text-[#0f2b4a]">
                                                {store.name}
                                            </span>
                                        </td>

                                        {/* Address */}
                                        <td className="px-4 py-5">
                                            <span className="text-[16px] text-[#60748e]">
                                                {store.address ||
                                                    "—"}
                                            </span>
                                        </td>

                                        {/* Overall rating */}
                                        <td className="px-4 py-5">
                                            <div className="flex items-center gap-3">
                                                <RatingStars
                                                    rating={
                                                        overallRating
                                                    }
                                                    size={22}
                                                />

                                                <span className="whitespace-nowrap text-[16px] text-[#526784]">
                                                    {overallRating.toFixed(
                                                        1
                                                    )}{" "}
                                                    (
                                                    {
                                                        totalRatings
                                                    }
                                                    )
                                                </span>
                                            </div>
                                        </td>

                                        {/* User rating */}
                                        <td className="px-4 py-5">
                                            <div className="flex items-center gap-3">
                                                <RatingStars
                                                    rating={
                                                        userRating
                                                    }
                                                    size={22}
                                                />

                                                <span className="whitespace-nowrap text-[15px] text-[#526784]">
                                                    {userRating >
                                                    0
                                                        ? "Tap to modify"
                                                        : "Tap to rate"}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rating modal */}
            {selectedStore && (
                <StoreRatingModal
                    store={selectedStore}
                    onClose={handleModalClose}
                    onRatingUpdated={
                        onRatingUpdated
                    }
                />
            )}
        </>
    );
};

export default StoreTable;