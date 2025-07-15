import axios from "axios";
import apibackend from "../backendAPI";
import { AppError } from "../types";

export const getResorts = async () => {
  try {
    const response = await apibackend.get("/resorts");
    console.log("Fetched resorts:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching resorts:", error);
    if (axios.isAxiosError(error)) {
        throw new AppError(error.response?.data || "Error fetching resorts" ,error.status || 500 
        );
    } else {
        throw new AppError("An unexpected error occurred.", 500);
    }
  }
};