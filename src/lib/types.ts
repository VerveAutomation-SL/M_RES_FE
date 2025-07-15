export interface Resort {
  id: number;
  name: string;
  location: string;
  Rooms: Room[];
}

export interface Room {
  id: number;
  room_number: string;
  resort_id: number;
}

export interface CheckIn {
  id: number;
  resort_id: number;
  room_number: string;
  guest_name: string;
  outlet_name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  check_in_date: string;
  check_in_time: string;
  Resort?: Resort;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

export interface ResortFormData {
  name: string;
  totalRooms: number;       
}

// types/AppError.ts
export class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
  super(message);
    this.name = 'AppError';
  }
  
}