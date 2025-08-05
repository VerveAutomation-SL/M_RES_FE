import axios from "axios";
import apibackend from "../backendAPI";
import { AppError, User } from "../types";

export async function getAllAdmins() {
    try {
        const response = await apibackend.get('/users/admins');
        return response.data;
    } catch (error) {
        console.error("Error fetching admins:", error);
        if (axios.isAxiosError(error)) {
        throw new AppError(error.response?.data || "Error fetching admins", error.status || 500);
        } else {
        throw new AppError("An unexpected error occurred during fetching admins", 500);
        }
    }
    
}

export async function getAllManagers() {
    try {
        const response = await apibackend.get('/users/managers');
        return response.data;
    } catch (error) {
        console.error("Error fetching managers:", error);
        if (axios.isAxiosError(error)) {
        throw new AppError(error.response?.data || "Error fetching managers", error.status || 500);
        } else {
        throw new AppError("An unexpected error occurred during fetching managers", 500);
        }
    }
}
export async function getAllHosts() {
    try {
        const response = await apibackend.get('/users/hosts');
        return response.data;
    } catch (error) {
        console.error("Error fetching hosts:", error);
        if (axios.isAxiosError(error)) {
        throw new AppError(error.response?.data || "Error fetching hosts", error.status || 500);
        } else {
        throw new AppError("An unexpected error occurred during fetching hosts", 500);
        }
    }
}

export async function createUser(adminData: Omit<User, "UserId" | "createdAt" | "updatedAt">) {
    try {
        const response = await apibackend.post('/users', adminData);
        return response.data;
    } catch (error) {
        console.error("Error creating admin:", error);
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data || "Error creating admin", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during creating admin", 500);
        }
    }
}

export async function getUserDetails(userId: number) {
    try {
        const response = await apibackend.get(`users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user details:", error);
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data || "Error fetching user details", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during fetching user details", 500);
        }
    }
}

export async function updateUserDetails(userId: number, userData: Partial<User>) {
    try {
        const response = await apibackend.put(`users/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user details:", error);
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data || "Error updating user details", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during updating user details", 500);
        }
    }
}

export async function deleteUser(userId: number) {
    try {
        const response = await apibackend.delete(`users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data || "Error deleting user", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during deleting user", 500);
        }
    }
}

export async function getActiveHosts() {
    try {
        const response = await apibackend.get('/users/active/hosts');
        return response.data;
    } catch (error) {
        console.error("Error fetching active hosts:", error);
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data || "Error fetching active hosts", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during fetching active hosts", 500);
        }
    }
}