import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { toast } from "sonner";

const FOCUS_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60;  // 5 minutes

type Mode = 'stopwatch' | 'pomodoro';
type PomodoroPhase = 'focus' | 'break';

export default function PracticeTimer() {
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>('focus');
  const [volume, setVolume] = useState(1); // 0 to 1
  const [muted, setMuted] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.src = '/bell.mp3';
    audio.preload = 'auto';
    
    audio.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
      audioRef.current = audio;
    });

    audio.addEventListener('error', (e) => {
      console.error('Error loading audio:', e);
    });

    return () => {
      audio.remove();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current!);
  }, [running]);

  useEffect(() => {
    if (mode === 'pomodoro') {
      const limit = pomodoroPhase === 'focus' ? FOCUS_TIME : BREAK_TIME;
      if (time >= limit) {
        if (audioRef.current) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('Audio playback failed:', error);
            });
          }
        }
        toast(
          pomodoroPhase === 'focus'
            ? "🎉 Focus session complete! Time for a break."
            : "✅ Break over. Back to focus."
        );
        setTime(0);
        setPomodoroPhase(pomodoroPhase === 'focus' ? 'break' : 'focus');
      }
    }
  }, [time, mode, pomodoroPhase]);

  const handleReset = () => {
    setTime(0);
    setRunning(false);
  };

  const formatTime = (t: number) => {
    const min = String(Math.floor(t / 60)).padStart(2, '0');
    const sec = String(t % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const displayTime =
    mode === 'pomodoro'
      ? (pomodoroPhase === 'focus' ? FOCUS_TIME - time : BREAK_TIME - time)
      : time;

  return (
    <Card className="max-w-sm p-6 mx-auto space-y-4 shadow-lg rounded-2xl">
      <CardContent className="flex flex-col items-center">
        <h2 className="mb-2 text-xl font-semibold capitalize">
          {mode === 'stopwatch' ? 'Stopwatch' : `Pomodoro - ${pomodoroPhase}`}
        </h2>

        <div className="my-4 font-mono text-5xl">
          {formatTime(displayTime)}
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setRunning((r) => !r)}>
            {running ? <Pause /> : <Play />}
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </div>

        <Button
          variant="link"
          className="mt-4 text-sm"
          onClick={() => {
            setMode(mode === 'pomodoro' ? 'stopwatch' : 'pomodoro');
            setTime(0);
            setRunning(false);
          }}
        >
          Switch to {mode === 'pomodoro' ? 'Stopwatch' : 'Pomodoro'}
        </Button>

        <div className="flex flex-col items-center w-full gap-2 mt-6">
          <div className="flex items-center w-full gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMuted(!muted)}
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Slider
              className="w-full"
              defaultValue={[volume * 100]}
              max={100}
              step={1}
              onValueChange={(values: number[]) => {
                setVolume(values[0] / 100);
                if (values[0] > 0 && muted) setMuted(false);
              }}
            />
          </div>
        </div>

        {!audioLoaded && (
          <p className="mt-2 text-sm text-yellow-600">Loading sound...</p>
        )}
      </CardContent>
    </Card>
  );
}
