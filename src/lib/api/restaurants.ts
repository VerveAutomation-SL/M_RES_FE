import apibackend from "../backendAPI";

export async function getAllRestaurants() {
  try {
    const response = await apibackend.get("/restaurants");
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
}