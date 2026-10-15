export const getWritingCharacters = (word: string): string[] =>
  Array.from(word.normalize('NFC')).filter((character) => {
    const code = character.codePointAt(0) ?? 0;
    return (
      code === 0x3007 ||
      (code >= 0x3400 && code <= 0x4dbf) ||
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0x20000 && code <= 0x323af)
    );
  });

export const WRITING_GRID_GAP = 12;

export const getWritingGridLayout = (characterCount: number, width: number) => {
  const columns = characterCount > 1 ? 2 : 1;
  const rows = Math.max(1, Math.ceil(characterCount / columns));
  const cellSize = Math.max(
    0,
    (width - WRITING_GRID_GAP * (columns - 1)) / columns,
  );
  return {
    columns,
    rows,
    gap: WRITING_GRID_GAP,
    height: rows * cellSize + (rows - 1) * WRITING_GRID_GAP,
  };
};
