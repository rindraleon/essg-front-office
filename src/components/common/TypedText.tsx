import { useTyped } from '@/hooks';
import { cn } from '@/lib';

export type TypedTextProps = {

  words: readonly string[];
  className?: string;
  cursorClassName?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
};

const TypedText = ({
  words,
  className,
  cursorClassName,
  typeSpeed,
  deleteSpeed,
  pauseDuration,
}: TypedTextProps) => {
  const { text, showCursor } = useTyped(words, { typeSpeed, deleteSpeed, pauseDuration });

  return (
    <span className={cn('inline-flex items-baseline', className)} aria-label={words.join(', ')}>
      <span aria-hidden="true">{text}</span>
      <span
        aria-hidden="true"
        className={cn(
          'ml-0.5 inline-block w-[2px] self-stretch bg-current transition-opacity duration-150',
          showCursor ? 'opacity-100' : 'opacity-0',
          cursorClassName
        )}
      />
    </span>
  );
};

export default TypedText;
