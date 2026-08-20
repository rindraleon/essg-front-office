import { splitWords } from '../../animations/split';
import { cn } from '@/lib/utils';

interface SplitTitleProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  'data-hero'?: string;
}

const SplitTitle = ({ text, as: Tag = 'h1', className, ...rest }: SplitTitleProps) => {
  const words = splitWords(text);

  return (
    <Tag aria-label={text} className={cn(className)} {...rest}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <span data-split="word" className="inline-block will-change-transform">
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </Tag>
  );
};

export default SplitTitle;
