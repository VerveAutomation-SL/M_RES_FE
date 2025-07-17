import { ApiResponse, Room } from "../types";
import { api } from "./config";

// Get all room for a specific resort
export const getRoomsByResort = async (resortId: number) => {
    try {
        const response = await api.get<ApiResponse<Room[]>>(`/resorts/${resortId}/rooms`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms by resort:', error);
        throw error;
    }
};

// Get all rooms
export const getAllRooms = async () => {
    try {
        const response = await api.get<ApiResponse<Room[]>>('/rooms');
        return response.data;
    } catch (error) {
        console.error('Error fetching all rooms:', error);
        throw error;
    }
};

// Create a new room 
export const createRoom = async(roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
        const response = await api.post<ApiResponse<Room>>('/rooms', roomData);
        return response.data;
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
};

// Get room by ID
export const getRoomById = async (roomId: number) => {
    try {
        const response = await api.get<ApiResponse<Room>>(`/rooms/${roomId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching room by ID:', error);
        throw error;
    }
};