import { AppError, User } from "@/lib/types";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export async function setDecodedUser(accessToken: string) {
  if (!accessToken) {
    throw new AppError("Token is required for decoding user", 400);
  }

  try {
    const user = jwtDecode<User>(accessToken);
    console.log("Decoded user:", user);

    if (
      user.role === "Admin" ||
      user.role === "Manager" ||
      user.role === "Host"
    ) {
      Cookies.set("accessToken", accessToken, {
        sameSite: "strict",
        secure: true,
        // httpOnly: true,
        expires: 1,
      });
    }

    return user;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

export function getDecodedUser() {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    console.warn("No token found in cookies");
    return null;
  }

  try {
    const user = jwtDecode<User>(accessToken);
    console.log("Decoded user from cookie:", user);
    const now = Math.floor(Date.now() / 1000);
    if (user.exp && user.exp < now) {
      console.warn("Token is expired");
      return null; // Token is expired
    }
    return user;
  } catch (err) {
    console.error("Invalid token in cookie", err);
    return null;
  }
}

export function getAccessToken() {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    console.warn("No access token found in cookies");
    return null;
  }
  return accessToken;
}
