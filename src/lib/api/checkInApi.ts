import { api } from './config';
import { ApiResponse, CheckIn, CheckInDetails } from '../types';

// Create a new check-in
export const processCheckIn = async (checkInData: Omit<CheckIn, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
        const response = await api.post<ApiResponse<CheckIn>>('/checkins/check-in', checkInData);
        return response.data;
    } catch (error) {
        console.error('Error processing check-in:', error);
        throw error;
    }
};

// Get check-in status for rooms by resort and meal type
export const getCheckInStatus = async (resortId: number, mealType: string) => {
    try {
        const response = await api.get<ApiResponse<CheckIn[]>>(
            `/checkins/room-status?resortId=${resortId}&mealType=${mealType}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching check-in status:', error);
        throw error;
    }
};

// Get all check-ins with filters
export const getAllCheckIns = async (params?: { 
    resortId?: number; 
    date?: string; 
    mealType?: string; 
}) => {
    try {
        const response = await api.get<ApiResponse<CheckIn[]>>('/checkins', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching check-ins:', error);
        throw error;
    }
};

// Get check-in details
export const getCheckInDetails = async (resortId: number, roomId: number, mealType: string) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const response = await api.get<ApiResponse<CheckInDetails>>(`/checkins/details?resortId=${resortId}&roomId=${roomId}&mealType=${mealType}&date=${today}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching check-in details:', error);
        throw error;
    }
};

// Process check-out
export const processCheckOut = async (checkOutData:{
    resortId: number;
    roomId: number;
    mealType: string;
    remarks?: string;
    date?: string;
}) => {
    try {
        const response = await api.post<ApiResponse<CheckIn>>('/checkins/check-out', checkOutData);
        return response.data;
    } catch (error) {
        console.error('Error processing check-out:', error);
        throw error;
    }
};


