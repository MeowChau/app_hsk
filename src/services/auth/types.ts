export interface Role {
  id: number;
  name: string;
}

export interface Status {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string | null;
  username: string | null;
  fullName: string | null;
  firstName?: string | null;
  lastName?: string | null;
  position?: string | null;
  level: number;
  currentExp: number;
  avatarFrame?: string | null;
  currentHskLevel?: number | null;
  targetHskLevel?: number | null;
  dailyStudyTime?: number | null;
  studentCode?: number | null;
  photo?: {
    id: string;
    path: string;
  } | null;
  role?: Role | null;
  status?: Status | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  username: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: User;
}

export interface RefreshResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
}

export interface UpdateProfileDto {
  fullName?: string;
  username?: string;
  currentHskLevel?: number;
  targetHskLevel?: number;
  dailyStudyTime?: number;
  avatarFrame?: string;
}
