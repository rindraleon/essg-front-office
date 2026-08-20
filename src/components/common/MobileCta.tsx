import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';

interface MobileCtaProps {
  label: string;
  link: string;
}

const MobileCta = ({ label, link }: MobileCtaProps) => {
  return (
    <div className="mt-8 sm:hidden">
      <Link to={link} className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
        {label}
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
};

export default MobileCta;
