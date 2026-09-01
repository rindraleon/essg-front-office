import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib';
import type { FaqAccordionProps } from '@/types';

const FaqAccordion = ({ faqs }: FaqAccordionProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const panelId = `faq-${index}`;
          const isOpen = expanded === panelId;
          return (
            <div
              key={panelId}
              className={cn(
                'overflow-hidden rounded-lg border border-ink-100 transition-[border-color,box-shadow] duration-(--duration-hover)',
                isOpen && 'border-brand-200 shadow-[0_12px_32px_-16px_rgb(84_124_54_/_0.35)]'
              )}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${panelId}-content`}
                onClick={() => setExpanded(isOpen ? null : panelId)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left font-semibold transition-[background-color,color] duration-(--duration-quick)',
                  'motion-reduce:transition-none',
                  isOpen ? 'bg-brand-50 text-brand-800' : 'text-ink-900 hover:bg-ink-50'
                )}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={cn(
                    'size-5 shrink-0 text-ink-400 transition-transform duration-(--duration-hover) ease-out motion-reduce:transition-none',
                    isOpen && 'rotate-180 text-brand-600'
                  )}
                />
              </button>

              <div
                id={`${panelId}-content`}
                aria-hidden={!isOpen}
                className={cn(
                  'grid transition-[grid-template-rows,opacity] duration-(--duration-hover) ease-out motion-reduce:transition-none',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="px-4 py-3 leading-7 text-ink-500">{faq.reponse}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaqAccordion;
