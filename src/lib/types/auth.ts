export interface LoginFormData {
    userName: string;
    password: string;
}

export interface AuthResponse {
    message: string
    user?: {
      fullName?: string
      email: string
    }
    error?: string
  }