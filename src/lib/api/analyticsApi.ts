import axios from "axios";
import { AnalyticsResponse, ApiResponse, AppError, PreviewApiResponse, ReportFilterData } from "../types"
import { api } from "./config"

export const getAnalyticsData = async () => {
    try{
        const response = await api.get<ApiResponse<AnalyticsResponse>>('/analytics');
        return response.data;
    } catch (error) {
        console.error("Error fetching analytics data:", error);
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data.message || "Error fetching analytics data", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during fetching analytics data", 500);
        }
    }
}

// Get preview data with filters
export const getPreviewData = async (filters: ReportFilterData & {page?: number, pageSize?: number}): Promise<PreviewApiResponse> => {
  try {
    const response = await api.post<PreviewApiResponse>('/reports/preview', filters);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data.message || "Error fetching preview data", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred during fetching preview data", 500);
        }
  }
};

// Export Excel report
export const exportExcelReport = async (filters: ReportFilterData): Promise<Blob> => {
  try {
    const response = await api.post('/reports/excel', filters,{
        responseType: 'blob',
        headers:{
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new AppError(error.response?.data.message || "Error exporting Excel report", error.status || 500);
    } else {
      throw new AppError("An unexpected error occurred during exporting Excel report", 500);
    }
  }
};

// Export PDF report
export const exportPdfReport = async (filters: ReportFilterData): Promise<Blob> => {
  try {
    const response = await api.post('/reports/pdf', filters, {
        responseType: 'blob',
        headers: {
            'Accept': 'application/pdf'
        }
    });
    return response.data;
  } catch (error) {
    console.error("Error exporting PDF report:", error);
    if (axios.isAxiosError(error)) {
      throw new AppError(error.response?.data.message || "Error exporting PDF report", error.status || 500);
    } else {
      throw new AppError("An unexpected error occurred during exporting PDF report", 500);
    }
  }
};