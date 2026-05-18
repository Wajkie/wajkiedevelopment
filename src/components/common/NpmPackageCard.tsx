'use client';

import { useState } from 'react';
import { NpmPackageObject } from '@/types';
import { Card } from '@/components/ui/Card';
import { NpmPackageModal } from './NpmPackageModal';
import { useTranslations, t } from '@/lib/i18n';

interface NpmPackageCardProps {
  package: NpmPackageObject;
}

export const NpmPackageCard = ({ package: pkg }: NpmPackageCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { package: info, downloads, score } = pkg;
  const tr = useTranslations();

  return (
    <>
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer p-6"
        onClick={() => setShowModal(true)}
      >
        <div className="space-y-5">
          {/* Header */}
          <div>
            <h3 className="font-bold text-lg mb-2">{info.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {info.description}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-600 dark:text-gray-400">⬇️</span>
              <span className="font-medium">{downloads.weekly}{tr.packages.perWeek}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-600 dark:text-gray-400">⭐</span>
              <span className="font-medium">{score.final.toFixed(1)}</span>
            </div>
            <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
              v{info.version}
            </span>
          </div>

          {/* Keywords (first 3) */}
          {info.keywords && info.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {info.keywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                >
                  {keyword}
                </span>
              ))}
              {info.keywords.length > 3 && (
                <span className="px-2 py-0.5 text-gray-500 text-xs">
                  {t(tr.packages.moreKeywords, { count: info.keywords.length - 3 })}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>

      {showModal && (
        <NpmPackageModal
          package={pkg}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
