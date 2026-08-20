import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/utils';


export interface AccordionItemProps {
  value: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  triggerClassName?: string;
}

export interface AccordionProps {
  items: AccordionItemProps[];
  type?: 'single' | 'multiple';
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({ items, type = 'single', className }) => {
  const [openValues, setOpenValues] = React.useState<string[]>([]);

  const toggle = (value: string) => {
    setOpenValues((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      if (type === 'single') return [value];
      return [...prev, value];
    });
  };

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => {
        const isOpen = openValues.includes(item.value);
        return (
          <div
            key={item.value}
            className={cn(
              'overflow-hidden rounded-xl border border-ink-100 bg-white shadow-sm transition-colors',
              isOpen && 'border-brand-200 shadow-[0_12px_32px_-16px_rgba(46,106,95,0.35)]'
            )}
          >
            <button
              type="button"
              onClick={() => toggle(item.value)}
              aria-expanded={isOpen}
              className={cn(
                'flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-small font-semibold text-ink-900 transition-colors hover:bg-brand-50/60',
                isOpen && 'bg-brand-50/60 text-brand-800',
                item.triggerClassName
              )}
            >
              {item.trigger}
              <ChevronDown
                className={cn(
                  'size-4 shrink-0 text-ink-400 transition-transform duration-300',
                  isOpen && 'rotate-180 text-brand-600'
                )}
              />
            </button>
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 text-small leading-7 text-ink-500">{item.children}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { Accordion };
