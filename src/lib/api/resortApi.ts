import { ApiResponse, Resort } from "../types";
import { api } from "./config";

// Get all resorts
export const getAllResorts = async () => {
    try {
        const response = await api.get<ApiResponse<Resort[]>>('/resorts');
        return response.data;
    } catch (error) {
        console.error('Error fetching resorts:', error);
        throw error;
    }
};

// Get resort by ID
export const getResortById = async (resortId: number) => {
    try{
        const response = await api.get<ApiResponse<Resort>>(`/resorts/${resortId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching resort by ID:', error);
        throw error;
    }
}