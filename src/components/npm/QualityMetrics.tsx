import { NpmScoreDetail } from '@/types';

interface QualityMetricsProps {
  detail: NpmScoreDetail;
  formatScore: (value: number) => string;
}

export const QualityMetrics = ({ detail, formatScore }: QualityMetricsProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg mb-3">Quality Metrics</h3>
      <div className="space-y-3">
        <MetricBar 
          label="Popularity" 
          value={detail.popularity} 
          color="blue"
          formatScore={formatScore}
        />
        <MetricBar 
          label="Quality" 
          value={detail.quality} 
          color="green"
          formatScore={formatScore}
        />
        <MetricBar 
          label="Maintenance" 
          value={detail.maintenance} 
          color="purple"
          formatScore={formatScore}
        />
      </div>
    </div>
  );
};

const MetricBar = ({ 
  label, 
  value, 
  color,
  formatScore 
}: { 
  label: string; 
  value: number; 
  color: 'blue' | 'green' | 'purple';
  formatScore: (value: number) => string;
}) => {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
  };

  const percentage = formatScore(value);

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-medium">{percentage}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`${colorClasses[color]} h-2 rounded-full transition-all`}
          style={{ width: percentage }}
        />
      </div>
    </div>
  );
}
