import axios from 'axios';
import { ApiResponse, CheckIn, Resort, Room } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL : API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Resort APIs
export const resortApi = {
    getAll : () => api.get<ApiResponse<Resort[]>>('/resorts'),
    create: (data: Omit<Resort, 'id' | 'createdAt' | 'updatedAt'>) => api.post<ApiResponse<Resort>>('/resorts', data),
    getById: (id: number) => api.get<ApiResponse<Resort>>(`/resorts/${id}`)
};

// Room APIs
export const roomApi = {
    getAll : (resortId? : number) => {
        const params = resortId ? { params: { resortId } } : {};
        return api.get<ApiResponse<Room[]>>('/rooms', params);
    },
    getAvailable : (resortId? : number) =>{
        const params = resortId ? {params : {resortId}} : {};
        return api.get<ApiResponse<Room[]>>('/rooms/available', params);
    },
    create: (data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => 
        api.post<ApiResponse<Room>>('/rooms', data),
};

// Check-in APIs
export const checkInApi = {
    getAll : (resortId? : number , date? : string) => {
        const params = date ? {date } : {};
        return api.get<ApiResponse<CheckIn[]>>(`/checkins/${resortId}`, { params });
    },
    process: (data: Omit<CheckIn, 'id' | 'createdAt' | 'updatedAt'>) =>
        api.post<ApiResponse<CheckIn>>('/checkins/process', data),
}