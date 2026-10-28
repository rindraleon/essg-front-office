import { useEffect, useState } from 'react';

const LOADING_MESSAGES = [
  'Chargement…',
  'Récupération des données…',
  'Synchronisation…',
  'Préparation de l’interface…',
];

export function CoreSpinLoader() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((index) => (index + 1) % LOADING_MESSAGES.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-label="Chargement en cours"
      aria-busy="true"
      className="flex min-h-[200px] flex-col items-center justify-center gap-8"
    >
      <div aria-hidden="true" className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-pulse rounded-full bg-brand-400/20 blur-xl motion-reduce:animate-none" />
        <div className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-brand-500/40 motion-reduce:animate-none" />
        <div className="absolute inset-1 animate-[spin_2s_linear_infinite] rounded-full border-2 border-transparent border-t-brand-500 shadow-[0_0_6px_rgba(120,164,78,0.5)] motion-reduce:animate-none" />
        <div className="absolute inset-3 animate-[spin_3s_linear_infinite_reverse] rounded-full border-2 border-transparent border-b-brand-700 shadow-[0_0_6px_rgba(66,97,44,0.4)] motion-reduce:animate-none" />
        <div className="absolute inset-5 animate-[spin_1s_ease-in-out_infinite] rounded-full border border-transparent border-l-brand-700/60 motion-reduce:animate-none" />
        <div className="absolute inset-0 animate-[spin_4s_linear_infinite] motion-reduce:animate-none">
          <div className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-600 shadow-[0_0_4px_rgba(84,124,54,0.9)]" />
        </div>
        <div className="absolute h-2 w-2 animate-pulse rounded-full bg-brand-700 shadow-[0_0_6px_rgba(84,124,54,0.6)] motion-reduce:animate-none" />
      </div>

      <div aria-hidden="true" className="flex h-8 flex-col items-center justify-center">
        <span
          key={messageIndex}
          className="animate-fade-in-up text-[10px] font-medium uppercase tracking-[0.3em] text-brand-700 motion-reduce:animate-none"
        >
          {LOADING_MESSAGES[messageIndex]}
        </span>
      </div>
    </div>
  );
}
