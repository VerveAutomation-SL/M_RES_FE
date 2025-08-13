import axios from "axios";
import { ApiResponse, AppError, Resort, ResortFormData } from "../types";
import { api } from "./config";

// Get all resorts
export const getAllResortsWithRooms = async () => {
    try {
        const response = await api.get<ApiResponse<Resort[]>>('/resorts/with-rooms');
        return response.data;
    } catch (error) {
        console.error("Error fetching resorts", error);
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data.message || "Error fetching resorts", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during fetching resorts", 500);
        }
    }
};

// Get resort by ID
export const getResortById = async (resortId: number) => {
    try{
        const response = await api.get<ApiResponse<Resort>>(`/resorts/${resortId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching resort by ID:", error);
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data.message || "Error fetching resort by ID", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during fetching resort by ID", 500);
        }
    }
};

// Create a new resort
export const createResort = async (resortData: ResortFormData) => {
    try {
        const response = await api.post<ApiResponse<Resort>>('/resorts', resortData);
        return response.data;
    } catch (error) {
        console.error("Error creating Resort:", error);
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data.message || "Error creating Resort", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during creating Resort", 500);
        }
    }
};