import { useEffect, useRef, useState } from 'react';
import { startPkMatchmaking, type PkMatchingState, type PkSession } from './pkMatchmaking';

export const usePkGame = (active: boolean, userId: number | undefined, level: number, attempt: number) => {
  const [entry, setEntry] = useState<{ attempt: number; userId?: number; state: PkMatchingState }>({ attempt, userId, state: { phase: 'connecting' } });
  const session = useRef<PkSession | null>(null);
  useEffect(() => {
    if (!active || !userId) return;
    const publish = (state: PkMatchingState) => setEntry({ attempt, userId, state });
    publish({ phase: 'connecting', hskLevel: level });
    const timer = setTimeout(() => { session.current = startPkMatchmaking(userId, level, publish); }, 250);
    return () => { clearTimeout(timer); session.current?.close(); session.current = null; };
  }, [active, userId, level, attempt]);
  const state: PkMatchingState = entry.attempt === attempt && entry.userId === userId ? entry.state : { phase: 'connecting', hskLevel: level };
  return { state, ready: async () => {
    if (!session.current) throw new Error('Đang kết nối PK.');
    await session.current.ready();
  }, answer: async (questionId: number, optionId: string) => {
    if (!session.current) throw new Error('Đang kết nối PK.');
    await session.current.answer(questionId, optionId);
  } };
};
