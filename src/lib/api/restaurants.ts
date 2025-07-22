import apibackend from "../backendAPI";
import axios from "axios";
import { AppError } from "../types";

export async function getAllRestaurants() {
  try {
    const response = await apibackend.get("/restaurant");
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    if (axios.isAxiosError(error)) {
      throw new AppError(error.response?.data || "Error fetching restaurants", error.status || 500 
      );
    } else {
        throw new AppError("An unexpected error occurred during fetching restaurants",500);
    }
  }
}

export async function getAllResortsWithRestaurants() {
  try {
    const response = await apibackend.get("/resorts/with-restaurants");
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    if (axios.isAxiosError(error)) {
      throw new AppError(error.response?.data || "Error fetching Resorts and Restaurants", error.status || 500 
      );
    } else {
        throw new AppError("An unexpected error occurred during fetching resorts and restaurants",500);
    }
  }
}