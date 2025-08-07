import axios from "axios";
import { ApiResponse, AppError, Room } from "../types";
import { api } from "./config";

// Get all room for a specific resort
export const getRoomsByResort = async (resortId: number) => {
    try {
        const response = await api.get<ApiResponse<Room[]>>(`/resorts/${resortId}/rooms`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms by resort:', error);
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data || "Error fetching rooms by resort", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during fetching rooms by resort", 500);
        }
    }
};

// Get all rooms
export const getAllRooms = async () => {
    try {
        const response = await api.get<ApiResponse<Room[]>>('/rooms');
        return response.data;
    } catch (error) {
        console.error('Error fetching all rooms:', error);
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data || "Error fetching all rooms", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during fetching all rooms", 500);
        }
    }
};

// Create a new room 
export const createRoom = async(roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
        const response = await api.post<ApiResponse<Room>>('/rooms', roomData);
        return response.data;
    } catch (error) {
        console.error('Error creating room:', error);
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data || "Error creating room", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during creating room", 500);
        }
    }
};

// Get room by ID
export const getRoomById = async (roomId: number) => {
    try {
        const response = await api.get<ApiResponse<Room>>(`/rooms/${roomId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching room by ID:', error);
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data || "Error fetching room by ID", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during fetching room by ID", 500);
        }
    }
};

// Update room by ID
export const updateRoom = async (roomId: number, roomData: Partial<Room>) => {
    try {
        console.log('Updating room with ID:', roomId, 'Data:', roomData);
        const response = await api.put<ApiResponse<Room>>(`/rooms/${roomId}`, roomData);
        return response.data;
    } catch (error) {
        console.error('Error updating room:', error);
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data || "Error updating room", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during updating room", 500);
        }
    }
}

// Delete room by ID
export const deleteRoom = async (roomId: number) => {
    try {
        const response = await api.delete<ApiResponse<Room>>(`/rooms/${roomId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting room:', error);
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data || "Error deleting room", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during deleting room", 500);
        }
    }
}