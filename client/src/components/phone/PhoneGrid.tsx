import React from 'react';
import { PhoneSummary } from '../../types';
import { PhoneCard } from './PhoneCard';

interface PhoneGridProps {
  phones: PhoneSummary[];
  comparingIds?: Array<string | number>;
  onCompareToggle?: (id: string | number) => void;
}

export const PhoneGrid: React.FC<PhoneGridProps> = ({
  phones,
  comparingIds = [],
  onCompareToggle
}) => {
  const compareSet = new Set(comparingIds.map(String));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {phones.map((phone) => (
        <PhoneCard
          key={phone.id}
          phone={phone}
          isComparing={compareSet.has(String(phone.id))}
          onCompareToggle={onCompareToggle}
        />
      ))}
    </div>
  );
};
