import React from 'react';
import { MatchingPlayerCard } from './MatchingPlayerCard';

interface MatchingOpponentCardProps {
  isMatched?: boolean;
  opponentName?: string;
  photoUrl?: string | null;
  busy?: boolean;
  failed?: boolean;
  ready?: boolean;
}

export const MatchingOpponentCard = ({ isMatched = false, opponentName, photoUrl, busy, failed, ready }: MatchingOpponentCardProps) => (
  <MatchingPlayerCard
    userName={isMatched ? opponentName || 'Đối thủ' : 'Đối thủ'}
    photoUrl={photoUrl}
    placeholder={!isMatched}
    tone={failed ? 'error' : ready ? 'matched' : 'pending'}
    statusText={failed ? 'Chưa ghép được' : isMatched ? ready ? 'Sẵn sàng' : 'Chờ sẵn sàng' : 'Chưa tìm thấy'}
    busy={busy}
  />
);

export default MatchingOpponentCard;
