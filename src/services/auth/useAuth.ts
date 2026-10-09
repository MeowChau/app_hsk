import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from './api';
import { LoginDto, RegisterDto, UpdateProfileDto, User } from './types';
import {
  saveAuthSession,
  saveUser,
  clearAuthSession,
  getUser,
  isAuthenticated,
} from '../storage';

export const AUTH_QUERY_KEYS = {
  profile: ['auth', 'profile'] as const,
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: LoginDto) => {
      const response = await authApi.login(dto);
      saveAuthSession(response);
      return response;
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
      const user = await authApi.getMe();
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
      const updated = await authApi.updateProfile(dto);
      saveUser(updated);
      return updated;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, updatedUser);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
      clearAuthSession();
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['auth'] });
    },
  });
};
