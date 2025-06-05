import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface PracticeExercise {
  name: string;
  bpm: number;
  duration: number;
  notes?: string;
}

export function SessionForm() {
  const [exercises, setExercises] = useState<PracticeExercise[]>([]);
  const [current, setCurrent] = useState<PracticeExercise>({ 
    name: "",
    bpm: 60,
    duration: 10,
    notes: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setCurrent({ ...current, [name]: name === "bpm" || name === "duration" ? +value : value });
  }

  function addExercise() {
    setExercises([...exercises, current]);
    setCurrent({ name: "", bpm: 60, duration: 10, notes: "" });
  }

  function saveSession() {
    const session = {
      date: new Date().toISOString(),
      exercises,
    };
    const stored = JSON.parse(localStorage.getItem("sessions") || "[]");
    localStorage.setItem("sessions", JSON.stringify([...stored, session]));
    setExercises([]);
    alert("Session saved!");
  }

  return (
  <Card className="max-w-xl p-4 mx-auto mt-6 space-y-4 shadow-sm">
      <CardContent className="space-y-4">
        <h2 className="text-xl font-bold">Log Guitar Practice Session</h2>
        <Input placeholder="Exercise name" name="name" value={current.name} onChange={handleChange} />
        <Input type="number" placeholder="BPM" name="bpm" value={current.bpm} onChange={handleChange} />
        <Input type="number" placeholder="Minutes practiced" name="duration" value={current.duration} onChange={handleChange} />
        <Textarea placeholder="Notes (optional)" name="notes" value={current.notes} onChange={handleChange} />

        <Button onClick={addExercise} className="w-full">Add Exercise</Button>

        {exercises.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Current Exercises:</h3>
            <ul className="space-y-1 list-disc list-inside">
              {exercises.map((ex, idx) => (
                <li key={idx}>
                  {ex.name} — {ex.bpm} BPM — {ex.duration} min
                </li>
              ))}
            </ul>
            <Button variant="secondary" onClick={saveSession} className="w-full">
              ✅ Save Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
