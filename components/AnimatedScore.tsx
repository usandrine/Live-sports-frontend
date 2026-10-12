'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedScoreProps {
  value: number;
  className?: string;
}

// Briefly pops + flashes yellow whenever the score value changes.
export default function AnimatedScore({ value, className = '' }: AnimatedScoreProps) {
  const prevRef = useRef(value);
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    if (prevRef.current !== value) {
      prevRef.current = value;
      setFlash((n) => n + 1);
    }
  }, [value]);

  return (
    <span
      // Changing the key restarts the CSS animation on each update
      key={flash}
      className={`inline-block tabular-nums ${flash > 0 ? 'animate-score-pop' : ''} ${className}`}
    >
      {value}
    </span>
  );
}
