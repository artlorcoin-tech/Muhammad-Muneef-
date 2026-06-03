import { useEffect, useRef } from 'react';
import { playSound } from '../lib/sound';

interface MatrixRainProps {
  active: boolean;
  onClose: () => void;
}

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';

export default function MatrixRain({ active, onClose }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    playSound('success');

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize) + 1;
    const drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * -100)); // offset starts for stagger

    let frameId: number;

    const draw = () => {
      // Semi-transparent background to create trail effect
      ctx.fillStyle = 'rgba(12, 10, 9, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#10b981'; // Green matrix color
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Pick random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw highlight character at head of stream
        if (Math.random() > 0.95) {
          ctx.fillStyle = '#fafaf9';
        } else {
          ctx.fillStyle = '#10b981';
        }

        ctx.fillText(text, x, y);

        // Reset drop to top once it goes past screen base
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape or enter turns off matrix rain
      if (e.key === 'Escape' || e.key === 'Enter') {
        playSound('toggle');
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, onClose]);

  if (!active) return null;

  return (
    <div
      onClick={() => {
        playSound('toggle');
        onClose();
      }}
      className="fixed inset-0 z-[105] cursor-pointer"
      title="Click or press ESC to exit matrix mode"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* HUD Exit Info overlay */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 border border-[#10b981]/30 bg-[#0c0a09]/80 text-[#10b981] font-mono text-[11px] rounded uppercase tracking-wider select-none pointer-events-none animate-pulse">
        MATRIX CORE RUNNING // CLICK SCREEN OR PRESS ESC TO TERMINATE
      </div>
    </div>
  );
}
