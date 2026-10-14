import { instance } from '../instance';
import {
  LoginDto,
  LoginResponse,
  RegisterDto,
  User,
  UpdateProfileDto,
  RefreshResponse,
  UpdateStudyGoalsDto,
  ResetPasswordDto,
  ChangePasswordDto,
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
    await instance.patch('auth/me', { json: dto });
    const updated = await authApi.getMe();
    if (dto.fullName !== undefined && updated.fullName !== dto.fullName.trim()) {
      throw new Error('Backend chưa lưu được tên hiển thị.');
    }
    return updated;
  },

  changePassword: async (dto: ChangePasswordDto): Promise<void> => {
    await instance.patch('auth/me', { json: dto });
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

  updateStudyGoals: async (dto: UpdateStudyGoalsDto): Promise<User> => {
    await instance.patch('users/me/study-goals', { json: dto });
    // A 200 response alone does not confirm persistence. The PATCH response
    // can also omit HSK fields due to the backend's serialization groups.
    const updated = await authApi.getMe();
    const fields = ['currentHskLevel', 'targetHskLevel', 'dailyStudyTime'] as const;
    if (fields.some((field) => dto[field] !== undefined && updated[field] !== dto[field])) {
      throw new Error('Máy chủ chưa lưu được trình độ HSK hoặc mục tiêu học. Vui lòng thử lại sau.');
    }
    return updated;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await instance.post('auth/forgot/password', {
      json: { email },
    });
  },

  resetPassword: async (dto: ResetPasswordDto): Promise<void> => {
    await instance.post('auth/reset/password', {
      json: dto,
    });
  },
};
