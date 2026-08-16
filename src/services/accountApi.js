import api from "./api";

export const updatePassword = async ({
    currentPassword,
    newPassword,
}) => {
    const response = await api.patch("/auth/password", {
        currentPassword,
        newPassword,
    });

    return response.data;
};