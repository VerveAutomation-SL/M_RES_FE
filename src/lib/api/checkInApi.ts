import { api } from './config';
import { ApiResponse, CheckIn, CheckInDetails, CheckInFormData, checkInRecord, RoomStatus } from '../types';

// Create a new check-in
export const processCheckIn = async (checkInData: CheckInFormData ) => {
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
        const response = await api.get<ApiResponse<RoomStatus[]>>(
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

// Get check-ins for today
export const getTodayCheckIns = async (resortId: number) => {
    try {
        const response = await api.get<ApiResponse<CheckIn[]>>(`/checkins/today?resortId=${resortId}`);
        return response.data;
    }catch (error) {
        console.error('Error fetching today\'s check-ins:', error);
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

// get all check-in record
export const getAllCheckInsToday = async (date?: string) => {
    try {
        const params = date? {params: { date }} : {};
        const response = await api.get<ApiResponse<checkInRecord[]>>('/checkins/today/all', params);
        return response.data;
    } catch (error) {
        console.error('Error fetching all check-ins:', error);
        throw error;
    }
};