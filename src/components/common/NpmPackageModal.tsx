'use client';

import { NpmPackageObject } from '@/types';
import { useNpmPackageData } from '@/hooks/useNpmPackageData';
import { PackageStats } from '@/components/npm/PackageStats';
import { QualityMetrics } from '@/components/npm/QualityMetrics';
import { PackageLinks } from '@/components/npm/PackageLinks';

interface NpmPackageModalProps {
  package: NpmPackageObject;
  onClose: () => void;
}

export const NpmPackageModal = ({ package: pkg, onClose }: NpmPackageModalProps) => {
  const {
    info,
    downloads,
    score,
    dependentsCount,
    lastUpdated,
    packageDate,
    formatScore,
  } = useNpmPackageData(pkg);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col bg-card rounded-lg border border-border shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold mb-2">{info.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{info.description}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          {/* Version & License */}
          <div className="flex gap-3 flex-wrap">
            <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
              v{info.version}
            </span>
            <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
              {info.license}
            </span>
          </div>

          <PackageStats 
            downloads={downloads} 
            score={score} 
            dependentsCount={dependentsCount} 
          />

          <QualityMetrics 
            detail={score.detail} 
            formatScore={formatScore} 
          />

          {/* Keywords */}
          {info.keywords && info.keywords.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {info.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Maintainers */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Maintainers</h3>
            <div className="space-y-2">
              {info.maintainers.map((maintainer) => (
                <div key={maintainer.username} className="flex items-center gap-2">
                  <span className="font-medium">{maintainer.username}</span>
                  <span className="text-gray-500 text-sm">({maintainer.email})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Published:</span>
              <div className="font-medium">{packageDate}</div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
              <div className="font-medium">{lastUpdated}</div>
            </div>
          </div>

          <PackageLinks links={info.links} />
        </div>
        </div>
      </div>
    </div>
  );
};
