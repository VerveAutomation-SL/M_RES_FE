import axios from "axios";
import { AppError } from "../types";
import { api } from "./config";

export async function tokenRefresh() {
    try {
        const response = await api.post("/token/refresh");
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data || "Authentication check failed" ,error.status || 500 
            );
        } else {
            throw new AppError("An unexpected error occurred during authentication check",500);
        }
    }
}

export async function login(
  formData: { userName: string; password: string },
) {
  try {
    const response = await api.post("/auth/login", {
      userName: formData.userName,
      password: formData.password,
    }); 
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
        throw new AppError(error.response?.data || "Request failed" ,error.status || 500 );
    } else {
        throw new AppError("An unexpected error occurred",500);
    }
  }
}

export async function logout() {
  try {
    const response = await api.post("/auth/logout");

    // Clear the token from the headers
    delete api.defaults.headers.common["Authorization"];

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data || "Logout request failed");
    } else {
      throw new Error("An unexpected error occurred during logout");
    }
  }
}

export async function forgotPassword(email: string) {
  try{
    const response = await api.post("/auth/forgot-password", {email});
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new AppError(error.response?.data || "Request failed", error.status || 500);
    } else {
      throw new AppError("An unexpected error occurred", 500);
    }
  }
}

export async function resetPassword(token: string, password: string) {
    try {
        const response = await api.post("/auth/reset-password", { token, password });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new AppError(error.response?.data || "Request failed", error.status || 500);
        } else {
            throw new AppError("An unexpected error occurred", 500);
        }
    }
}