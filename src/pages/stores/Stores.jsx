import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import Header from "../../components/layout/Header";
import StoreTable from "../../components/stores/StoreTable";

import {
    getStores,
    getStoreRatings,
} from "../../services/storeApi";

const Stores = () => {
    const [stores, setStores] = useState([]);

    const [nameSearch, setNameSearch] = useState("");
    const [addressSearch, setAddressSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [ratingLoading, setRatingLoading] = useState(false);
    const [error, setError] = useState("");

    /*
     * Load stores
     */
    const loadStores = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getStores({
                page: 1,
                limit: 100,
            });

            const storeList =
                response?.data?.stores ||
                response?.stores ||
                [];

            setStores(storeList);
        } catch (err) {
            console.error(
                "Stores error:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load stores."
            );

            setStores([]);
        } finally {
            setLoading(false);
        }
    };

    /*
     * Initial stores load
     */
    useEffect(() => {
        loadStores();
    }, []);

    /*
     * Load current user's ratings
     *
     * The backend returns all ratings for each store.
     * We find the rating belonging to the logged-in user
     * and merge it into the store object.
     */
    useEffect(() => {
        if (!stores.length) {
            return;
        }

        const loadUserRatings = async () => {
            try {
                setRatingLoading(true);

                const currentUser =
                    JSON.parse(
                        localStorage.getItem("user") ||
                            "null"
                    );

                const currentUserId =
                    currentUser?.id;

                if (!currentUserId) {
                    console.warn(
                        "Current user ID not found."
                    );

                    return;
                }

                const storesWithRatings =
                    await Promise.all(
                        stores.map(
                            async (store) => {
                                try {
                                    const response =
                                        await getStoreRatings(
                                            store.id
                                        );

                                    const ratings =
                                        response?.data
                                            ?.ratings ||
                                        response?.ratings ||
                                        [];

                                    const currentUserRating =
                                        ratings.find(
                                            (rating) =>
                                                rating.userId ===
                                                currentUserId
                                        );

                                    return {
                                        ...store,

                                        userRating:
                                            currentUserRating
                                                ?.rating ||
                                            0,

                                        userComment:
                                            currentUserRating
                                                ?.comment ||
                                            "",
                                    };
                                } catch (err) {
                                    console.error(
                                        `Failed to load rating for store ${store.id}`,
                                        err
                                    );

                                    return {
                                        ...store,
                                        userRating: 0,
                                        userComment: "",
                                    };
                                }
                            }
                        )
                    );

                setStores(storesWithRatings);
            } catch (err) {
                console.error(
                    "User ratings error:",
                    err
                );
            } finally {
                setRatingLoading(false);
            }
        };

        loadUserRatings();
    }, []);

    /*
     * Search
     */
    const filteredStores = useMemo(() => {
        return stores.filter((store) => {
            const name =
                store.name?.toLowerCase() || "";

            const address =
                store.address?.toLowerCase() || "";

            const matchesName =
                name.includes(
                    nameSearch.toLowerCase()
                );

            const matchesAddress =
                address.includes(
                    addressSearch.toLowerCase()
                );

            return (
                matchesName &&
                matchesAddress
            );
        });
    }, [
        stores,
        nameSearch,
        addressSearch,
    ]);

    /*
     * Refresh after rating submission/update
     */
    const handleRatingUpdated = async () => {
        await loadStores();
    };

    return (
        <div className="min-h-screen bg-[#faf9f5]">
            <Header />

            <main className="mx-auto max-w-[1350px] px-6 pb-12 pt-10">
                {/* Heading */}
                <div>
                    <h1 className="text-[28px] font-semibold tracking-tight text-[#17263a]">
                        Registered stores
                    </h1>

                    <p className="mt-1 text-[15px] text-[#657084]">
                        Search stores and submit or modify
                        your rating from 1 to 5.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Search */}
                <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="relative">
                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#657084]"
                        />

                        <input
                            type="text"
                            placeholder="Search by name"
                            value={nameSearch}
                            onChange={(e) =>
                                setNameSearch(
                                    e.target.value
                                )
                            }
                            className="h-11 w-full rounded-xl border border-[#dedbd3] bg-white pl-11 pr-4 text-[15px] text-[#17263a] shadow-sm outline-none placeholder:text-[#63738a] focus:border-[#9ba5b2]"
                        />
                    </div>

                    <div className="relative">
                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#657084]"
                        />

                        <input
                            type="text"
                            placeholder="Search by address"
                            value={addressSearch}
                            onChange={(e) =>
                                setAddressSearch(
                                    e.target.value
                                )
                            }
                            className="h-11 w-full rounded-xl border border-[#dedbd3] bg-white pl-11 pr-4 text-[15px] text-[#17263a] shadow-sm outline-none placeholder:text-[#63738a] focus:border-[#9ba5b2]"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="mt-7">
                    {loading || ratingLoading ? (
                        <div className="rounded-2xl border border-[#dfdcd4] bg-white px-6 py-10 text-center">
                            <p className="text-[15px] text-[#657084]">
                                Loading stores...
                            </p>
                        </div>
                    ) : (
                        <StoreTable
                            stores={filteredStores}
                            loading={false}
                            onRatingUpdated={
                                handleRatingUpdated
                            }
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default Stores;