import { instance } from '../instance';
import {
  LoginDto,
  LoginResponse,
  RegisterDto,
  User,
  UpdateProfileDto,
  RefreshResponse,
} from './types';
import { getRefreshToken } from '../storage';

export const authApi = {
  login: async (dto: LoginDto): Promise<LoginResponse> => {
    return instance
      .post('auth/email/login', {
        json: dto,
      })
      .json<LoginResponse>();
  },

  register: async (dto: RegisterDto): Promise<void> => {
    await instance.post('auth/email/register', {
      json: dto,
    });
  },

  getMe: async (): Promise<User> => {
    return instance.get('auth/me').json<User>();
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<User> => {
    return instance
      .patch('auth/me', {
        json: dto,
      })
      .json<User>();
  },

  refreshToken: async (): Promise<RefreshResponse> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    return instance
      .post('auth/refresh', {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      })
      .json<RefreshResponse>();
  },

  logout: async (): Promise<void> => {
    try {
      await instance.post('auth/logout');
    } catch {
      // Ignore network errors on logout
    }
  },

  forgotPassword: async (email: string): Promise<{ hash: string }> => {
    return instance
      .post('auth/forgot/password', {
        json: { email },
      })
      .json<{ hash: string }>();
  },

  resetPassword: async (
    hash: string,
    otp: string,
    password: string,
  ): Promise<void> => {
    await instance.post('auth/reset/password', {
      json: { hash, otp, password },
    });
  },
};
