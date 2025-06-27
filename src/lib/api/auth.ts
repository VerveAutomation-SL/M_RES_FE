import type { LoginFormData, AuthResponse } from "@/lib/types/auth"


export const loginUser = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return response.json()
}
