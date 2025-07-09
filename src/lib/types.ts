export interface Resort {
  id?: number;
  name?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
  totalRooms?: number; 
  booked?: number; 
  available?: number; 
  rooms?: Room[];

}

export interface Room {
  id: number;
  room_number: string;
  status: 'available' | 'occupied';
  resort_id: number;
  Resort?: Resort;
  createdAt: string;
  updatedAt: string;
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