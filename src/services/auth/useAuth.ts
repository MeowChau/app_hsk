import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from './api';
import {
  LoginDto,
  RegisterDto,
  UpdateProfileDto,
  UpdateStudyGoalsDto,
  ResetPasswordDto,
  ChangePasswordDto,
  User,
} from './types';
import {
  saveAuthSession,
  saveUser,
  clearAuthSession,
  getUser,
  isAuthenticated,
  getAuthSessionVersion,
  getSurveyData,
  hasPendingSurvey,
  saveSurveyData,
} from '../storage';
import { syncPendingSurvey } from './survey';

export const AUTH_QUERY_KEYS = {
  profile: ['auth', 'profile'] as const,
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: LoginDto) => {
      const response = await authApi.login(dto);
      saveAuthSession(response);
      const user = await syncPendingSurvey(response.user);
      if (getUser<User>()?.id === user.id) saveUser(user);
      return { ...response, user };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (dto: RegisterDto) => {
      return authApi.register(dto);
    },
  });
};

export const useProfile = () => {
  const hasToken = isAuthenticated();

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: async () => {
      const version = getAuthSessionVersion();
      const user = await authApi.getMe();
      if (version !== getAuthSessionVersion()) throw new Error('Phiên đăng nhập đã thay đổi.');
      saveUser(user);
      return user;
    },
    initialData: () => getUser<User>() ?? undefined,
    enabled: hasToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateProfileDto) => {
      const version = getAuthSessionVersion();
      const updated = await authApi.updateProfile(dto);
      if (version !== getAuthSessionVersion()) throw new Error('Phiên đăng nhập đã thay đổi.');
      saveUser(updated);
      return updated;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, updatedUser);
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const version = getAuthSessionVersion();
      try { await authApi.logout(); }
      finally { if (version === getAuthSessionVersion()) clearAuthSession(); }
    },
    onSuccess: () => {
      void queryClient.cancelQueries();
      queryClient.removeQueries();
    },
  });
};

export const useUpdateStudyGoals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateStudyGoalsDto) => {
      const version = getAuthSessionVersion();
      const updated = await authApi.updateStudyGoals(dto);
      if (version !== getAuthSessionVersion()) throw new Error('Phiên đăng nhập đã thay đổi.');
      saveUser(updated);
      const answers = getSurveyData(updated.id);
      if (answers && hasPendingSurvey(updated.id)) {
        // A later Survey retry must preserve goals already saved in Settings.
        saveSurveyData(updated.id, {
          ...answers,
          ...(dto.currentHskLevel !== undefined ? { currentLevel: `HSK ${dto.currentHskLevel}` } : {}),
          ...(dto.targetHskLevel !== undefined ? { targetLevel: `HSK ${dto.targetHskLevel}` } : {}),
          ...(dto.dailyStudyTime !== undefined ? { dailyTime: `${dto.dailyStudyTime} phút` } : {}),
        });
      }
      return updated;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, updatedUser);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (dto: ChangePasswordDto) => {
      const version = getAuthSessionVersion();
      await authApi.changePassword(dto);
      if (version !== getAuthSessionVersion()) {
        throw new Error('Phiên đăng nhập đã thay đổi. Vui lòng đăng nhập lại.');
      }
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (dto: ResetPasswordDto) => authApi.resetPassword(dto),
  });
};
