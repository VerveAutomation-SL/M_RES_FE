import apibackend from "../backendAPI";

export async function getAllRestaurants() {
  try {
    const response = await apibackend.get("/restaurant");
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
}

export async function getAllResorts() {
  try {
    const response = await apibackend.get("/resort");
    return response.data;
  } catch (error) {
    console.error("Error fetching resorts:", error);
    throw error;
  }
}