import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { toast } from 'sonner';

interface TimerProps {
  onTick?: () => void;
  className?: string;
  autoStart?: boolean;
  onReset?: () => void;
  onStartStop?: (running: boolean) => void;
  initialTime?: number;
  isPracticeTimer?: boolean;
  onTimeUpdate?: (time: number) => void;
}

type TimerMode = 'work' | 'break';

export function Timer({
  onTick,
  className = '',
  autoStart = false,
  onReset,
  onStartStop,
  initialTime,
  isPracticeTimer = false,
  onTimeUpdate,
}: TimerProps) {
  const [time, setTime] = useState(
    initialTime ?? (isPracticeTimer ? 0 : 25 * 60)
  );
  const [running, setRunning] = useState(autoStart);
  const [mode, setMode] = useState<TimerMode>('work');
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const WORK_TIME = 25 * 60; // 25 minutes
  const BREAK_TIME = 5 * 60; // 5 minutes
  const LONG_BREAK_TIME = 15 * 60; // 15 minutes
  const CYCLES_BEFORE_LONG_BREAK = 4;

  const handlePeriodComplete = useCallback(() => {
    if (isPracticeTimer) return;

    const audio = new Audio('/bell.mp3');
    audio.play();

    if (mode === 'work') {
      const completedCycles = cycles + 1;
      setCycles(completedCycles);

      if (completedCycles % CYCLES_BEFORE_LONG_BREAK === 0) {
        setTime(LONG_BREAK_TIME);
        toast.success('Time for a long break!');
      } else {
        setTime(BREAK_TIME);
        toast.success('Time for a break!');
      }
      setMode('break');
    } else {
      setTime(WORK_TIME);
      setMode('work');
      toast.success('Back to work!');
    }
  }, [isPracticeTimer, mode, cycles, LONG_BREAK_TIME, BREAK_TIME, WORK_TIME]);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTime(prev => {
          const newTime = isPracticeTimer ? prev + 1 : prev - 1;
          if (!isPracticeTimer && prev <= 1) {
            handlePeriodComplete();
            return 0;
          }
          onTick?.();
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current!);
  }, [running, mode, isPracticeTimer, handlePeriodComplete, onTick]);

  useEffect(() => {
    onStartStop?.(running);
  }, [running, onStartStop]);

  useEffect(() => {
    onTimeUpdate?.(time);
  }, [time, onTimeUpdate]);

  const handleSkip = () => {
    if (isPracticeTimer) return;
    setTime(0);
  };

  const handleReset = () => {
    const newTime = isPracticeTimer ? 0 : WORK_TIME;
    setTime(newTime);
    setRunning(false);
    if (!isPracticeTimer) {
      setMode('work');
      setCycles(0);
    }
    onReset?.();
    onTimeUpdate?.(newTime);
  };

  const formatTime = (t: number) => {
    const min = String(Math.floor(t / 60)).padStart(2, '0');
    const sec = String(t % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center p-6">
        {!isPracticeTimer && (
          <>
            <div className="mb-4 text-lg font-semibold">
              {mode === 'work' ? 'Focus Time' : 'Break Time'}
            </div>

            <div className="mb-2 text-sm text-muted-foreground">
              Cycle: {Math.floor(cycles / 2) + 1}
            </div>
          </>
        )}

        <div className="my-4 font-mono text-5xl">{formatTime(time)}</div>

        <div className="flex gap-2">
          <Button onClick={() => setRunning(r => !r)}>
            {running ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          {!isPracticeTimer && (
            <Button variant="outline" onClick={handleSkip}>
              <SkipForward className="w-4 h-4" />
            </Button>
          )}
          <Button variant="secondary" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {!isPracticeTimer && (
          <div className="mt-4 text-sm text-center text-muted-foreground">
            {mode === 'work'
              ? 'Stay focused! Take a break when the timer ends.'
              : 'Time to recharge! Next session starts soon.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
