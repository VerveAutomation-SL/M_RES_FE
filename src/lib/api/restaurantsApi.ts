import axios from "axios";
import { AppError } from "../types";
import { api } from "./config";

export async function getAllResorts() {
  try {
    const response = await api.get("/resorts");
    return response.data;
  } catch (error) {
    console.error("Error fetching Resorts:", error);
    if (axios.isAxiosError(error)) {
      throw new AppError(error.response?.data || "Error fetching Resorts", error.status || 500 
      );
    } else {
        throw new AppError("An unexpected error occurred during fetching Resorts",500);
    }
  }
}

export async function getAllRestaurants() {
  try {
    const response = await api.get("/restaurants");
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
    const response = await api.get("/resorts/with-restaurants");
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

export async function getRestaurantById(id: number) {
  try {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant by ID:", error);
    if (axios.isAxiosError(error)) {
      throw new AppError(error.response?.data || "Error fetching restaurant by ID", error.status || 500 
      );
    } else {
        throw new AppError("An unexpected error occurred during fetching restaurant by ID",500);
    }
  }
}

export async function createRestaurant(restaurantData: {
  restaurantName: string;
  resort_id: string;
  status: 'Open' | 'Close';
}) {
  try {
    const response = await api.post("/restaurants", restaurantData);
    return response.data;
  } catch (error) {
    console.error("Error creating restaurant:", error);
    if (axios.isAxiosError(error)) {
      throw new AppError(error.response?.data || "Error creating restaurant", error.status || 500 
      );
    } else {
        throw new AppError("An unexpected error occurred during creating restaurant",500);
    }
  }
}

export async function updateRestaurant(id: number, restaurantData: {
  restaurantName?: string;
  resort_id?: number;
  status?: 'Open' | 'Close';
}) {
  try {
    console.log("Updating restaurant with ID:", id, "Data:", restaurantData);
    const response = await api.put(`/restaurants/${id}`, restaurantData);
    return response.data;
  } catch (error) {
    console.error("Error updating restaurant:", error);
    if (axios.isAxiosError(error)) {
      throw new AppError(error.response?.data || "Error updating restaurant", error.status || 500 
      );
    } else {
        throw new AppError("An unexpected error occurred during updating restaurant",500);
    }
  }
}

export async function deleteRestaurant(id: number) {
  try {
    const response = await api.delete(`/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    if (axios.isAxiosError(error)) {
      throw new AppError(error.response?.data || "Error deleting restaurant", error.status || 500 
      );
    } else {
        throw new AppError("An unexpected error occurred during deleting restaurant",500);
    }
  }
}