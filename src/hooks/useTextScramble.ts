import { useState, useEffect, useCallback, useRef } from 'react';

const scrambleChars = '█░_?+X01%#*@&';

export function useTextScramble(originalText: string, duration = 1.2) {
  const [displayText, setDisplayText] = useState(originalText);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const scramble = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    startTimeRef.current = Date.now();
    
    const tick = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      const result = originalText
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          
          const charProgress = index / originalText.length;
          
          // Gradually resolve from left to right based on progress
          if (progress > charProgress) {
            return char;
          }
          
          // Show scrambled characters with dynamic shuffling
          if (Math.random() < 0.28) {
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }
          return char;
        })
        .join('');

      setDisplayText(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayText(originalText);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [originalText, duration]);

  useEffect(() => {
    scramble();
    return () => cancelAnimationFrame(frameRef.current);
  }, [scramble]);

  return { displayText, scramble };
}
