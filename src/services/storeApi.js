import api from "./api";

export const getStores = async ({
    search = "",
    address = "",
    page = 1,
    limit = 10,
} = {}) => {
    const params = {
        page,
        limit,
    };

    if (search) {
        params.search = search;
    }

    if (address) {
        params.address = address;
    }

    const response = await api.get("/stores", {
        params,
    });

    return response.data;
};

export const getStoreRatings = async (storeId) => {
    const response = await api.get(`/ratings/store/${storeId}`);

    return response.data;
};

export const createStore = async (storeData) => {
    const response = await api.post(
        "/stores",
        storeData
    );

    return response.data;
};

/*
 * First-time rating
 * POST /api/ratings/store/:storeId
 */
export const createRating = async (
    storeId,
    ratingData
) => {
    const response = await api.post(
        `/ratings/store/${storeId}`,
        ratingData
    );

    return response.data;
};

/*
 * Existing rating
 * PATCH /api/ratings/store/:storeId
 */
export const updateRating = async (
    storeId,
    ratingData
) => {
    const response = await api.patch(
        `/ratings/store/${storeId}`,
        ratingData
    );

    return response.data;
};