import { create } from 'zustand';
import Cookies from 'js-cookie';
import { User } from '@/lib/types';
import { getDecodedUser, setDecodedUser } from '@/utils/decoedUser';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUserFromCookie: () => void;
  login_user: (token: string) => void;
  logout_user: () => void;
  autoLogin: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUserFromCookie: () => {
    const user =  getDecodedUser();

    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },

  login_user: (token: string) => {
    setDecodedUser(token);
    const user = getDecodedUser();

    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

    autoLogin: () => {
        const user = getDecodedUser();
        if (user) {
            set({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
        } else {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },

  logout_user: () => {
    Cookies.remove('accessToken');
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
