import { Badge } from '../ui/badge';
import { cn } from '@/lib';

interface CategoryChipProps {
  category: string;
  size?: 'small' | 'medium';
  className?: string;
}

const categoryColors: Record<string, string> = {
  Événement: 'border-brand-200 bg-brand-50 text-brand-800',
  Partenariat: 'border-amber-200 bg-amber-50 text-amber-800',
  Recherche: 'border-brand-200 bg-brand-50 text-brand-800',
  'Vie Étudiante': 'border-pink-200 bg-pink-50 text-pink-800',
};

const CategoryChip = ({ category, size = 'small', className }: CategoryChipProps) => {
  return (
    <Badge
      className={cn(
        categoryColors[category] || 'border-indigo-100 bg-indigo-50 text-indigo-800',
        size === 'medium' && 'text-caption px-3 py-1',
        className
      )}
    >
      {category}
    </Badge>
  );
};

export default CategoryChip;
