import { NpmLinks } from '@/types';
import Button from '../ui/Button';

interface PackageLinksProps {
  links: NpmLinks;
}

export const PackageLinks = ({ links }: PackageLinksProps) => {
  return (
    <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
      <Button
        onClick={() => window.open(links.npm, '_blank')}
        className="flex-1"
      >
        View on NPM
      </Button>
      
      {links.repository && (
        <Button
          onClick={() => window.open(links.repository, '_blank')}
          variant="secondary"
          className="flex-1"
        >
          Repository
        </Button>
      )}
      
      {links.homepage && (
        <Button
          onClick={() => window.open(links.homepage, '_blank')}
          variant="secondary"
          className="flex-1"
        >
          Homepage
        </Button>
      )}
    </div>
  );
};
