export interface OfflineGameWord {
  id: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
  hskLevel: number;
}

export interface OfflineTopScore {
  id: number;
  score: number;
  playedAt: string;
}

export interface SubmitScoreDto {
  score: number;
}
