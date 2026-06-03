import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  
  const ringRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const requestRef = useRef<number>(0);

  // Check if device supports a precision pointer (mouse)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Update mouse position reference
  useEffect(() => {
    if (!isFinePointer) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) {
        setIsVisible(true);
        // Set body class to hide standard cursor
        document.documentElement.classList.add('custom-cursor-active');
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
      document.documentElement.classList.remove('custom-cursor-active');
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [isFinePointer, isVisible]);

  // Inertial lerp animation for the outer ring
  useEffect(() => {
    if (!isFinePointer) return;

    const animateRing = () => {
      const lerpFactor = 0.15; // Speed of inertia follow
      
      const newX = ringRef.current.x + (mouseRef.current.x - ringRef.current.x) * lerpFactor;
      const newY = ringRef.current.y + (mouseRef.current.y - ringRef.current.y) * lerpFactor;

      ringRef.current = { x: newX, y: newY };
      setRingPosition({ x: newX, y: newY });

      requestRef.current = requestAnimationFrame(animateRing);
    };

    requestRef.current = requestAnimationFrame(animateRing);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isFinePointer]);

  // Bind mouseover/mouseout to check for interactive items
  useEffect(() => {
    if (!isFinePointer) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.closest('.interactive-item') !== null ||
        target.closest('[role="button"]') !== null;

      if (isInteractive) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovered(false);
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isFinePointer]);

  if (!isFinePointer || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999]">
      {/* Inner Dot */}
      <div
        className="fixed -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#f97316] rounded-full transition-transform duration-200"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovered ? 0 : 1})`,
        }}
      />

      {/* Outer Inertial Ring */}
      <div
        className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f97316] transition-all duration-300 ease-out"
        style={{
          left: `${ringPosition.x}px`,
          top: `${ringPosition.y}px`,
          width: isHovered ? '40px' : '22px',
          height: isHovered ? '40px' : '22px',
          backgroundColor: isHovered ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
          borderColor: isHovered ? '#f97316' : 'rgba(249, 115, 22, 0.5)',
          boxShadow: isHovered ? '0 0 15px rgba(249, 115, 22, 0.2)' : 'none',
        }}
      />
    </div>
  );
}
