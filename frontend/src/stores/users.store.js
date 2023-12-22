import { defineStore } from "pinia";

import UserDataService from "../services/UserDataService";

export const useUserStore = defineStore({
  id: "users",
  state: () => ({
    users: { loading: false, data: null, error: null },
  }),
  actions: {
    async getAllUsers() {
      this.users = { loading: true, data: null, error: null };
      try {
        const users = await UserDataService.getAll();
        this.users = { loading: false, data: users.data, error: null };
      } catch (error) {
        this.users = { loading: false, data: null, error };
      }
    },

    async createUser(userData) {
      try {
        const newUser = await UserDataService.create(userData);
        // Optionally, you can update the local state with the new user
        this.users.data.push(newUser);
        return newUser;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async updateUser({ userId, userData }) {
      try {
        const updatedUser = await UserDataService.update(userId, userData);
        // Optionally, you can update the local state with the updated user
        const index = this.users.data.findIndex((user) => user._id === userId);
        if (index !== -1) {
          this.users.data.splice(index, 1, updatedUser);
        }
        return updatedUser;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async deleteUser(userId) {
      try {
        await UserDataService.delete(userId);
        // Optionally, you can update the local state by removing the deleted user
        this.users.data = this.users.data.filter((user) => user._id !== userId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async deleteAllUsers() {
      try {
        await UserDataService.deleteAll();
        // Optionally, you can update the local state by removing all users
        this.users.data = [];
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async findUsersByCriteria(criteria) {
      this.users = { loading: true, data: null, error: null };
      try {
        const users = await UserDataService.findByTitle(criteria);
        this.users = { loading: false, data: users, error: null };
      } catch (error) {
        this.users = { loading: false, data: null, error };
      }
    },
  },
});
