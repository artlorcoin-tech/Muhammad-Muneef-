import { useEffect, useRef } from 'react';

export function use3DTilt<T extends HTMLElement>(maxRotation = 8) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Create a dynamic glare overlay element inside the card
    const glare = document.createElement('div');
    glare.style.position = 'absolute';
    glare.style.inset = '0';
    glare.style.pointerEvents = 'none';
    glare.style.zIndex = '10';
    glare.style.borderRadius = 'inherit';
    glare.style.opacity = '0';
    glare.style.transition = 'opacity 0.3s ease';
    glare.style.background = 'radial-gradient(circle at var(--glare-x, 0px) var(--glare-y, 0px), rgba(249, 115, 22, 0.08) 0%, transparent 60%)';
    
    // Ensure relative positioning for correct absolute bounds
    const originalPosition = window.getComputedStyle(el).position;
    if (originalPosition === 'static') {
      el.style.position = 'relative';
    }
    
    el.appendChild(glare);

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const midX = rect.width / 2;
      const midY = rect.height / 2;

      // Calculate tilt angles based on cursor offset from card center
      const rotX = -((y - midY) / midY) * maxRotation;
      const rotY = ((x - midX) / midX) * maxRotation;

      el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.015, 1.015, 1.015)`;
      el.style.transition = 'transform 0.1s ease-out';

      // Update glare coordinates
      glare.style.setProperty('--glare-x', `${x}px`);
      glare.style.setProperty('--glare-y', `${y}px`);
      glare.style.opacity = '1';
    };

    const onMouseLeave = () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      el.style.transition = 'transform 0.5s ease-out';
      glare.style.opacity = '0';
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
      glare.remove();
    };
  }, [maxRotation]);

  return elementRef;
}
