import { AnalyticsResponse, ApiResponse, checkInRecord, ReportFilterData } from "../types"
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

// Get preview data with filters
export const getPreviewData = async (filters: ReportFilterData): Promise<checkInRecord[]> => {
  try {
    const response = await api.post<{ success: boolean; data: checkInRecord[] }>('/reports/preview', filters);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching preview data:", error);
    throw error;
  }
};

// Export Excel report
export const exportExcelReport = async (filters: ReportFilterData): Promise<Blob> => {
  try {
    const response = await api.post('/reports/excel', filters,{
        responseType:'blob',
        headers:{
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });
    return response.data;
  } catch (error) {
    console.error("Error exporting Excel report:", error);
    throw error;
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
    throw error;
  }
};