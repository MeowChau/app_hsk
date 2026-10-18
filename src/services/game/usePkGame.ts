import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { startPkMatchmaking, type PkMatchingState, type PkSession } from './pkMatchmaking';
import { applyExperienceSnapshot } from '../auth/experience';
import { authApi } from '../auth/api';
import { getAuthSessionVersion, getTokenExpires, getUser, subscribeAuthSession } from '../storage';

export const usePkGame = (active: boolean, userId: number | undefined, level: number, attempt: number) => {
  const queryClient = useQueryClient();
  const [entry, setEntry] = useState<{ attempt: number; userId?: number; state: PkMatchingState }>({ attempt, userId, state: { phase: 'connecting' } });
  const session = useRef<PkSession | null>(null);
  useEffect(() => {
    if (!active || !userId) return;
    let receiving = true;
    const version = getAuthSessionVersion();
    const publish = (state: PkMatchingState) => {
      if (!receiving) return;
      const reward = state.phase === 'finished'
        ? state.result?.rewards?.find(item => item.userId === userId)
        : undefined;
      if (reward && version === getAuthSessionVersion()) applyExperienceSnapshot(queryClient, userId, reward);
      setEntry({ attempt, userId, state });
    };
    publish({ phase: 'connecting', hskLevel: level });
    const unsubscribe = subscribeAuthSession(() => {
      if (version !== getAuthSessionVersion()) publish({ phase: 'error', message: 'Phiên đăng nhập đã thay đổi. Vui lòng quay lại sảnh.' });
    });
    const start = async () => {
      try {
        const expires = getTokenExpires();
        // The authenticated HTTP client refreshes an expired token safely before
        // the socket reads it. No socket is created while this request is pending.
        if (!expires || expires <= Date.now() + 5000) await authApi.getMe();
        if (!receiving || version !== getAuthSessionVersion()) return;
        if (getUser<{ id: number }>()?.id !== userId) {
          publish({ phase: 'error', message: 'Phiên đăng nhập đã thay đổi. Vui lòng quay lại sảnh.' });
          return;
        }
        session.current = startPkMatchmaking(userId, level, publish);
      } catch (error) {
        if (!receiving || version !== getAuthSessionVersion()) return;
        publish({ phase: 'error', message: error instanceof Error && error.message.startsWith('Phiên đăng nhập')
          ? error.message : 'Không thể xác thực tài khoản PK. Vui lòng kiểm tra kết nối và thử lại.' });
      }
    };
    const timer = setTimeout(() => { void start(); }, 250);
    return () => { receiving = false; unsubscribe(); clearTimeout(timer); session.current?.close(); session.current = null; };
  }, [active, userId, level, attempt, queryClient]);
  const state: PkMatchingState = entry.attempt === attempt && entry.userId === userId ? entry.state : { phase: 'connecting', hskLevel: level };
  return { state, ready: async () => {
    if (!session.current) throw new Error('Đang kết nối PK.');
    await session.current.ready();
  }, answer: async (questionId: number, optionId: string) => {
    if (!session.current) throw new Error('Đang kết nối PK.');
    await session.current.answer(questionId, optionId);
  } };
};
