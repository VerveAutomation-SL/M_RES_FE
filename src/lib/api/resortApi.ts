import { ApiResponse, Resort } from "../types";
import { api } from "./config";

// Get all resorts
export const getAllResortsWithRooms = async () => {
    try {
        const response = await api.get<ApiResponse<Resort[]>>('/resorts/with-rooms');
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
};

// Create a new resort
export const createResort = async (resortData: Omit<Resort, 'id'>) => {
    try {
        const response = await api.post<ApiResponse<Resort>>('/resorts', resortData);
        return response.data;
    } catch (error) {
        console.error('Error creating resort:', error);
        throw error;
    }
};