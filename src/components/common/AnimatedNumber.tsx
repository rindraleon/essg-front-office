import React, { useEffect, useRef, useState } from 'react';

interface NumericParts {
  prefix: string;
  value: number;
  suffix: string;
  decimals: number;
}

function parseNumericValue(value: string): NumericParts | null {
  const trimmed = value.trim();
  const firstDigit = trimmed.search(/\d/);
  if (firstDigit < 0) return null;

  const prefix = trimmed.slice(0, firstDigit);
  const numericPart = trimmed.slice(firstDigit);
  const match = /^\d+(?:[.,]\d+)?/.exec(numericPart);
  if (!match) return null;

  const rawNumber = match[0].replace(',', '.');
  const numericValue = Number.parseFloat(rawNumber);
  if (!Number.isFinite(numericValue)) return null;

  return {
    prefix,
    value: numericValue,
    suffix: numericPart.slice(match[0].length),
    decimals: rawNumber.includes('.') ? (rawNumber.split('.')[1]?.length ?? 0) : 0,
  };
}

interface AnimatedNumberProps {
  value: string;
  className?: string;
  duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, className, duration = 1800 }) => {
  const parts = parseNumericValue(value);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!parts || started) return;
    const element = ref.current;
    if (!element) return;

    const finish = () => {
      setCurrent(parts.value);
      setStarted(true);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      finish();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setStarted(true);
        observer.disconnect();

        const startTime = performance.now();
        const tick = (now: number) => {
          const elapsed = Math.min(1, (now - startTime) / duration);
          const eased = 1 - (1 - elapsed) ** 3;
          setCurrent(parts.value * eased);
          if (elapsed < 1) window.requestAnimationFrame(tick);
          else setCurrent(parts.value);
        };

        window.requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [duration, parts, started]);

  if (!parts) {
    return <span className={className}>{value}</span>;
  }

  const rendered =
    parts.decimals > 0 ? current.toFixed(parts.decimals) : Math.round(current).toString();

  return (
    <span ref={ref} className={className} aria-label={value}>
      {parts.prefix}
      {rendered}
      {parts.suffix}
    </span>
  );
};

export default AnimatedNumber;
