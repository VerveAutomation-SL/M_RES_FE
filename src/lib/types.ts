export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

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
  status: "available" | "occupied" ;
  createdAt: string;
  updatedAt: string;
}

export interface CheckIn {
  id: number;
  guest_name?: string;
  room_id: number;
  outlet_name: string;
  meal_type: string;
  meal_plan: string;
  table_number: string;
  resort_id: number;
  check_in_time: string;
  check_out_time?: string;
  checkout_remarks?: string;
  status: "checked_in" | "checked_out";
  createdAt: string;
  updatedAt: string;
}

export interface CheckInFormData {
  resort_name: string;
  room_id: number;
  room_number?: string;
  outlet_name: string;
  meal_type: string;
  meal_plan: string;
  table_number: string;
  resort_id: number;
}

export interface CheckInDetails {
  id: number;
  name: string;
  room_number: string;
  outlet_name: string;
  meal_type: string;
  meal_plan: string;
  table_number: string;
  check_in_time: string;
  createdAt: string;
  status: string;
}

export type CheckInRequest = Omit<CheckIn, 'id' | 'createdAt' | 'updatedAt'>;

export interface ResortFormData {
  name: string;
  location: string;       
}

export interface RoomFormData {
  room_number: string;
  resortId: number;
  name?: string; 
}

export interface CheckInAnalyticsData{
  resort_id: number;
  total_checkins: number;
  checkin_date: string;
}

export interface MealDistributionData {
  meal_type: string;
  meals_count: string;
  meals_percentage: string;
}

export interface HourlyTrendsData{
  hour:number;
  time:string;
  checkIns:number;  
}

export interface AnalyticsResponse {
  checkInsLastWeek: CheckInAnalyticsData[];
  mealDistribution: MealDistributionData[];
  hourlyTrends: HourlyTrendsData[];
}

export interface ReportFilterData{
  checkinStartDate?: string;
  checkinEndDate?: string;
  checkoutStartDate?: string;
  checkoutEndDate?: string;
  resort_id?:  | null;
  outlet_name?: string | null;
  room_id?: number | null;
  table_number?: string | null;
  meal_type?: string | null;
  meal_plan?: string | null;
  status?: string | null;
};

export interface checkInRecord{
 id: number;
  room_number: string;
  resort_name: string;
  outlet_name: string;
  table_number: string;
  meal_type: string;
  meal_plan: string;
  check_in_date: string;
  check_in_time: string;
  check_out_date?: string;
  check_out_time?: string;
  status: string;
  checkout_remarks?: string;
}

export class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
  super(message);
    this.name = 'AppError';
  }
  
}