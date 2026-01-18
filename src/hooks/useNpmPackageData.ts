import { NpmPackageObject } from '@/types';

export const useNpmPackageData = (pkg: NpmPackageObject) => {
  const { package: info, downloads, score, dependents, updated } = pkg;
  
  const dependentsCount = typeof dependents === 'string' 
    ? parseInt(dependents) || 0 
    : dependents;

  const lastUpdated = new Date(updated).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const packageDate = new Date(info.date).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formatScore = (value: number) => `${(value * 100).toFixed(0)}%`;

  return {
    info,
    downloads,
    score,
    dependentsCount,
    lastUpdated,
    packageDate,
    formatScore,
  };
};
