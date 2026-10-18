import type { QueryClient } from '@tanstack/react-query';
import type { User } from './types';
import { AUTH_QUERY_KEYS } from './useAuth';
import { getUser, saveUser } from '../storage';
import { getTotalExperience } from '../leaderboard/experience';

export interface ExperienceSnapshot {
  level: number;
  currentExp: number;
  totalExp: number;
}

// Use the server's balance, never add a client-selected reward to the balance.
// Concurrent check-in and PK responses can arrive in either order; EXP only grows.
export const applyExperienceSnapshot = (
  queryClient: QueryClient,
  userId: number,
  snapshot: ExperienceSnapshot,
): void => {
  if (getUser<User>()?.id !== userId) return;
  if (!Number.isInteger(snapshot.level) || snapshot.level < 1 ||
    !Number.isSafeInteger(snapshot.currentExp) || snapshot.currentExp < 0 ||
    !Number.isSafeInteger(snapshot.totalExp) || snapshot.totalExp < 0 ||
    getTotalExperience(snapshot) !== snapshot.totalExp) return;

  const update = (user: User | null | undefined) => {
    if (user?.id !== userId || getTotalExperience(user) > snapshot.totalExp) return user;
    return { ...user, level: snapshot.level, currentExp: snapshot.currentExp };
  };
  queryClient.setQueryData<User>(AUTH_QUERY_KEYS.profile, previous => update(previous) ?? undefined);
  const saved = getUser<User>();
  const next = update(saved);
  if (next && next !== saved) saveUser(next);
};
