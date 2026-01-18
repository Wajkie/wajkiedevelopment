import { NpmDownloads, NpmScore } from '@/types';

interface PackageStatsProps {
  downloads: NpmDownloads;
  score: NpmScore;
  dependentsCount: number;
}

export const PackageStats = ({ downloads, score, dependentsCount }: PackageStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard value={downloads.weekly} label="Weekly Downloads" color="blue" />
      <StatCard value={downloads.monthly} label="Monthly Downloads" color="purple" />
      <StatCard value={score.final.toFixed(1)} label="Final Score" color="green" />
      <StatCard value={dependentsCount} label="Dependents" color="orange" />
    </div>
  );
};

const StatCard = ({ 
  value, 
  label, 
  color 
}: { 
  value: string | number; 
  label: string; 
  color: 'blue' | 'purple' | 'green' | 'orange';
}) => {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className={`text-xl font-bold ${colorClasses[color]}`}>
        {value}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{label}</div>
    </div>
  );
};
