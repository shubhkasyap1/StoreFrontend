import api from "./api";

export const getOwnerDashboard = async ({
    storeId = "",
    rating = "",
    search = "",
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
} = {}) => {
    const params = {
        page,
        limit,
        sortBy,
        sortOrder,
    };

    if (storeId) {
        params.storeId = storeId;
    }

    if (rating) {
        params.rating = rating;
    }

    if (search) {
        params.search = search;
    }

    const response = await api.get("/ratings/owner", {
        params,
    });

    return response.data;
};