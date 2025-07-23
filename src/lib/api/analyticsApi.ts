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

export const getPreviewData = async () => {
    try {
    const response = await api.post<{ success: boolean; data: CheckInRecord[] }>('/reports/preview', filters);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching preview data:", error);
    throw error;
  }
};