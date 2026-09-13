import React from 'react';
import { ScreenHeader } from '@/components/molecules';

interface Props {
  onBack: () => void;
}

export const EducationHeader = ({ onBack }: Props) => {
  return <ScreenHeader title="Học & Luyện tập HSK" onBack={onBack} />;
};

export default EducationHeader;
