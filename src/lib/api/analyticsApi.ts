import { AnalyticsResponse, ApiResponse } from "../types"
import { api } from "./config"

export const getAnalyticsData = async () => {
    try{
        const response = await api.get<ApiResponse<AnalyticsResponse>>('/analytics');
        return response.data;
    } catch (error) {
        console.error("Error fetching analytics data:", error);
        throw error;
    }
}