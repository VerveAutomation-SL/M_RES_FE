export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Resort {
  id: number;
  name: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: number;
  number: string;
  resortId: number;
  status: "available" | "occupied" ;
  createdAt: string;
  updatedAt: string;
}

export interface CheckIn {
  id: number;
  guest_name: string;
  room_number: string;
  outlet_name: string;
  meal_type: string;
  meal_plan: string;
  table_number: string;
  resort_id: number;
  check_in_time: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckInFormData {
  resort_name: string;
  room_number: string;
  outlet_name: string;
  meal_type: string;
  meal_plan: string;
  table_number: string;
  resort_id: number;
}

