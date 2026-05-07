
import apiClient from "./apiClient";

export const usersApi = {
  getAllUsers: async () => {
    const response = await apiClient.get("/users");
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  createUser: async (data) => {
    const response = await apiClient.post("/users", data);
    return response.data;
  },

  updateUserProfile: async (userId, data) => {
    const response = await apiClient.put(`/users/${userId}/profile`, data);
    return response.data;
  },

  getUserHistory: async (userId) => {
    const response = await apiClient.get(`/users/${userId}/history`);
    return response.data;
  },

  getRestorePoints: async (userId) => {
    const response = await apiClient.get(`/users/${userId}/restore-points`);
    return response.data;
  },

  restoreUserProfile: async (userId, requestedTime) => {
    const response = await apiClient.post(
      `/users/${userId}/restore`,
      null,
      {
        params: {
          requestedTime,
        },
      }
    );

    return response.data;
  },
};