export interface Resort {
  id: number;
  name: string;
  location: string;
  restaurants?: Restaurant[];
  rooms?: Room[];
  createdAt: string;
  updatedAt: string;
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

export interface Restaurant {
  id: number;
  restaurantName: string;
  resort_id: number;
  diningTables: DiningTable[]; 
  status: 'Open' | 'Closed';
}

export interface DiningTable {
  id: number;
  tableNumber: string;
  restaurant_id: number;
  status: 'available' | 'occupied';
  Restaurant?: Restaurant;
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

export class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
  super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}