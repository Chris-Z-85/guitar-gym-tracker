import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { PracticeGoal, PracticeGoalForm } from './PracticeGoal';
import { supabase } from "@/components/supabaseClient.ts";
import { Timer } from './Timer';

interface PracticeTimerProps {
  initialGoal?: PracticeGoal;
}

export default function PracticeTimer({ initialGoal }: PracticeTimerProps) {
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<PracticeGoal | null>(initialGoal || null);
  const [practiceTime, setPracticeTime] = useState(0);

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

  const handleGoalSet = async (goal: PracticeGoal) => {
    setCurrentGoal(goal);
    setPracticeTime(0);
  };

  const handleFinishSession = async () => {
    if (!currentGoal) return;

    try {
      // Only save if there's actual practice time
      if (practiceTime === 0) {
        toast.error("Practice duration must be greater than 0 seconds");
        return;
      }

      const session = {
        date: new Date().toISOString(),
        exercises: [{
          name: currentGoal.name,
          bpm: currentGoal.targetBpm,
          duration: practiceTime,
          notes: currentGoal.notes
        }]
      };

      const { error } = await supabase
        .from('practice_sessions')
        .insert([session]);

      if (error) throw error;

      toast.success("Practice session saved!");
      setCurrentGoal(null);
      setPracticeTime(0);
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error("Failed to save session");
    }
  };

  if (!currentGoal) {
    return <PracticeGoalForm onGoalSet={handleGoalSet} />;
  }

  return (
    <Card className="max-w-sm p-6 mx-auto space-y-4 shadow-lg rounded-2xl">
      <CardContent className="flex flex-col items-center">
        <h2 className="mb-2 text-xl font-semibold capitalize">
          {currentGoal.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          Target BPM: {currentGoal.targetBpm}
        </p>

        <Timer 
          autoStart={!!initialGoal}
          onReset={() => setPracticeTime(0)}
          isPracticeTimer={true}
          initialTime={practiceTime}
          onTimeUpdate={setPracticeTime}
        />

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

        <Button 
          onClick={handleFinishSession}
          className="w-full mt-4"
          variant="secondary"
          disabled={practiceTime === 0}
        >
          Finish Session
        </Button>

        {!audioLoaded && (
          <p className="mt-2 text-sm text-yellow-600">Loading sound...</p>
        )}
      </CardContent>
    </Card>
  );
}
