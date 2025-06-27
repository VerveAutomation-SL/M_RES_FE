export interface LoginFormData {
    userName: string;
    password: string;
    role: string;
}

export interface AuthResponse {
    message: string
    user?: {
      fullName?: string
      email: string
    }
    error?: string
  }