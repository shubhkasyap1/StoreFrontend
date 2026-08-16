import api from "./api";

export const getAdminDashboard = async () => {
    const response = await api.get("/admin/dashboard");

    return response.data;
};

export const getAdminUsers = async ({
    search = "",
    role = "",
    page = 1,
    limit = 100,
} = {}) => {
    const params = {
        page,
        limit,
    };

    if (search) {
        params.search = search;
    }

    if (role) {
        params.role = role;
    }

    const response = await api.get("/admin/users", {
        params,
    });

    return response.data;
};

export const createAdminUser = async (userData) => {
    const response = await api.post(
        "/admin/users",
        userData
    );

    return response.data;
};

