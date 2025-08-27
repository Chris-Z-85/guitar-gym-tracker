import { useRef, useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BpmSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const MIN_BPM = 40;
const MAX_BPM = 240;

function getBpmRotation(bpm: number): number {
  // Map BPM range to 0-180 degrees, reversed so higher BPM is right
  return 180 - ((bpm - MIN_BPM) / (MAX_BPM - MIN_BPM)) * 180;
}

export function BpmSelector({ value, onChange }: BpmSelectorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Helper to get the current circle position
  const getCirclePosition = (bpm: number) => {
    const angle = (Math.PI * getBpmRotation(bpm)) / 180;
    return {
      x: 100 + 90 * Math.cos(angle),
      y: 100 - 90 * Math.sin(angle),
    };
  };

  const calculateBpmFromCoords = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;

    const x = clientX - rect.left - rect.width / 2;
    const y = rect.height - (clientY - rect.top);
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    if (angle < 0) angle = 0;
    if (angle > 180) angle = 180;
    // Reverse mapping for clockwise
    return Math.round(MIN_BPM + ((180 - angle) / 180) * (MAX_BPM - MIN_BPM));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Get mouse position relative to SVG
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    // Get current circle position
    const { x, y } = getCirclePosition(value);
    // Circle position is in SVG coordinates (0-200, 0-100)
    // Scale mouseX/mouseY to SVG coordinates
    const svgWidth = rect.width;
    const svgHeight = rect.height;
    const scaleX = 200 / svgWidth;
    const scaleY = 100 / svgHeight;
    const svgMouseX = mouseX * scaleX;
    const svgMouseY = mouseY * scaleY;
    // Calculate distance from mouse to circle
    const dist = Math.sqrt((svgMouseX - x) ** 2 + (svgMouseY - y) ** 2);
    if (dist <= 15) {
      // threshold in SVG units
      setIsDragging(true);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newBpm = calculateBpmFromCoords(e.clientX, e.clientY);
      if (newBpm !== null) {
        onChange(newBpm);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onChange]);

  return (
    <div>
      <h2 className="flex items-center gap-2 mb-2 text-lg font-semibold text-foreground">
        <Target size={18} /> Target BPM
      </h2>
      <div className="relative w-full mb-4 h-44">
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox="0 0 200 100"
          onMouseDown={handleMouseDown}
          style={{ cursor: 'pointer' }}
        >
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="#3f3f46"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle
            cx={getCirclePosition(value).x}
            cy={getCirclePosition(value).y}
            r="10"
            fill="#f87171"
            stroke="#fff"
            strokeWidth="2"
            style={{ touchAction: 'none' }}
            className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-extrabold text-foreground text-7xl drop-shadow-md">
            {value}
          </span>
          <span className="text-base tracking-widest text-gray-400">BPM</span>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <Button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            console.log('BPMSelector: - button clicked, current value:', value);
            onChange(Math.max(value - 1, MIN_BPM));
          }}
          variant="outline"
          type="button"
        >
          -
        </Button>
        <Button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            console.log('BPMSelector: + button clicked, current value:', value);
            onChange(Math.min(value + 1, MAX_BPM));
          }}
          variant="outline"
          type="button"
        >
          +
        </Button>
      </div>
    </div>
  );
}
