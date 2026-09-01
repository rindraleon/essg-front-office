import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FaqAccordionProps } from '../../types/faq.types';

const FaqAccordion = ({ faqs }: FaqAccordionProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="rounded-[1.5rem] border border-ink-100 bg-white p-6 shadow-card sm:p-8">
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const panelId = `faq-${index}`;
          const isOpen = expanded === panelId;
          return (
            <div
              key={panelId}
              className={cn(
                'overflow-hidden rounded-[0.9rem] border border-ink-100 transition-all duration-200',
                isOpen && 'border-brand-200 shadow-[0_12px_32px_-16px_rgba(46,106,95,0.35)]'
              )}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${panelId}-content`}
                onClick={() => setExpanded(isOpen ? null : panelId)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left font-semibold transition-colors',
                  isOpen ? 'bg-brand-50 text-brand-800' : 'text-ink-900 hover:bg-ink-50'
                )}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={cn(
                    'size-5 shrink-0 text-ink-400 transition-transform duration-200',
                    isOpen && 'rotate-180 text-brand-600'
                  )}
                />
              </button>
              {isOpen && (
                <div id={`${panelId}-content`} className="px-4 py-3 animate-fade-in">
                  <p className="leading-7 text-ink-500">{faq.reponse}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaqAccordion;
