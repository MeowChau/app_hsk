export type AudioQuestion = {
  id: string;
  index: number;
  audioUrl?: unknown;
  sharedAudio?: boolean;
};

export type SharedAudioRow<T> =
  | { kind: 'audio_header'; id: string; audioUrl: string; label: string }
  | { kind: 'audio_end'; id: string }
  | { kind: 'question'; id: string; question: T; sharedAudioHeaderId?: string };

// Preserve question order: reusing a track later does not merge unrelated parts.
export function buildSharedAudioRows<T extends AudioQuestion>(
  questions: readonly T[],
  canShare: (question: T) => boolean = () => true,
): SharedAudioRow<T>[] {
  const rows: SharedAudioRow<T>[] = [];
  const audioUrl = (question: T) =>
    canShare(question) && typeof question.audioUrl === 'string'
      ? question.audioUrl.trim() || undefined
      : undefined;
  for (let start = 0; start < questions.length;) {
    const url = audioUrl(questions[start]);
    let end = start;
    while (end + 1 < questions.length && audioUrl(questions[end + 1]) === url)
      end++;
    const shared =
      !!url &&
      (end > start ||
        questions
          .slice(start, end + 1)
          .some((question) => question.sharedAudio));
    const headerId = shared ? `audio:${questions[start].id}` : undefined;
    if (shared && headerId) {
      const first = questions[start].index;
      const last = questions[end].index;
      rows.push({
        kind: 'audio_header',
        id: headerId,
        audioUrl: url,
        label: first === last ? `Câu ${first}` : `Câu ${first}–${last}`,
      });
    }
    for (let index = start; index <= end; index++) {
      rows.push({
        kind: 'question',
        id: questions[index].id,
        question: questions[index],
        sharedAudioHeaderId: headerId,
      });
    }
    // This empty sticky row pushes the previous player away before the next part/footer.
    if (headerId) rows.push({ kind: 'audio_end', id: `end:${headerId}` });
    start = end + 1;
  }
  return rows;
}

export function audioStickyHeaderIndices(
  rows: readonly { kind: string }[],
  listHeaderOffset = 0,
) {
  return rows.flatMap((row, index) =>
    row.kind === 'audio_header' || row.kind === 'audio_end'
      ? [index + listHeaderOffset]
      : [],
  );
}
