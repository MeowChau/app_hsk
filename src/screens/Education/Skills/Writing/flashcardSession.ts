export type FlashcardRating = 'unknown' | 'remembered';
export type FlashcardPhase = 'learn' | 'review' | 'complete';

export interface FlashcardSession {
  wordIds: string[];
  reviewWordIds: string[];
  difficultWordIds: string[];
  ratings: Record<string, FlashcardRating>;
  reviewRatings: Record<string, FlashcardRating>;
  phase: FlashcardPhase;
  index: number;
}

type FlashcardAction =
  | { type: 'reset'; wordIds: string[] }
  | { type: 'move'; direction: -1 | 1 }
  | {
      type: 'rate';
      wordId: string;
      phase: FlashcardPhase;
      rating: FlashcardRating;
    };

export const createFlashcardSession = (
  wordIds: string[],
): FlashcardSession => ({
  wordIds: [...new Set(wordIds)],
  reviewWordIds: [],
  difficultWordIds: [],
  ratings: {},
  reviewRatings: {},
  phase: 'learn',
  index: 0,
});

export const getFlashcardWordIds = (session: FlashcardSession): string[] =>
  session.phase !== 'learn' && session.reviewWordIds.length > 0
    ? session.reviewWordIds
    : session.wordIds;

export const flashcardSessionReducer = (
  session: FlashcardSession,
  action: FlashcardAction,
): FlashcardSession => {
  if (action.type === 'reset') return createFlashcardSession(action.wordIds);
  if (session.phase === 'complete') return session;

  const wordIds = getFlashcardWordIds(session);
  if (wordIds.length === 0) return session;

  if (action.type === 'move') {
    return {
      ...session,
      index: Math.max(
        0,
        Math.min(wordIds.length - 1, session.index + action.direction),
      ),
    };
  }

  // Ignore a second tap dispatched for a card that has already advanced.
  if (
    action.wordId !== wordIds[session.index] ||
    action.phase !== session.phase
  ) {
    return session;
  }

  const ratings = {
    ...(session.phase === 'learn' ? session.ratings : session.reviewRatings),
    [action.wordId]: action.rating,
  };
  const next = {
    ...session,
    ...(session.phase === 'learn' ? { ratings } : { reviewRatings: ratings }),
    difficultWordIds:
      action.rating === 'unknown' &&
      !session.difficultWordIds.includes(action.wordId)
        ? [...session.difficultWordIds, action.wordId]
        : session.difficultWordIds,
  };

  let nextIndex = wordIds.findIndex(
    (id, index) => index > session.index && !ratings[id],
  );
  if (nextIndex < 0) nextIndex = wordIds.findIndex((id) => !ratings[id]);
  if (nextIndex >= 0) return { ...next, index: nextIndex };

  if (session.phase === 'learn') {
    const reviewWordIds = session.wordIds.filter(
      (id) => ratings[id] === 'unknown',
    );
    if (reviewWordIds.length > 0) {
      return { ...next, phase: 'review', index: 0, reviewWordIds };
    }
  }

  // One extra pass is enough; difficult words continue into writing practice.
  return { ...next, phase: 'complete' };
};

export const getWritingWordOrder = (session: FlashcardSession): string[] => {
  const difficult = new Set(session.difficultWordIds);
  const priority = (id: string) =>
    difficult.has(id) ? 0 : session.ratings[id] ? 2 : 1;
  return [...session.wordIds].sort(
    (left, right) => priority(left) - priority(right),
  );
};

export const orderWritingWords = <T extends { id: string | number }>(
  words: T[],
  wordOrder: string[] = [],
): T[] => {
  const order = new Map(wordOrder.map((id, index) => [id, index]));
  return [...words].sort(
    (left, right) =>
      (order.get(String(left.id)) ?? Number.MAX_SAFE_INTEGER) -
      (order.get(String(right.id)) ?? Number.MAX_SAFE_INTEGER),
  );
};
