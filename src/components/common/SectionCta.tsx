import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import MobileCta from './MobileCta';

interface SectionCtaProps {
  label: string;
  link: string;
}

const SectionCta = ({ label, link }: SectionCtaProps) => {
  return (
    <>
      <div className="mb-4 mt-6 hidden justify-center sm:flex">
        <Link to={link} className={cn(buttonVariants({ variant: 'outline' }))}>
          {label}
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <MobileCta label={label} link={link} />
    </>
  );
};

export default SectionCta;
