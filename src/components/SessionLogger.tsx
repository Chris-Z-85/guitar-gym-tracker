import { useState } from "react";
import { db } from "@/components/firebaseClient";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { useAuth } from "@/lib/context/AuthProvider";

interface PracticeExercise {
  name: string;
  bpm: number;
  duration: number;
  notes?: string;
}

const SessionLogger: React.FC = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<PracticeExercise[]>([]);
  const [current, setCurrent] = useState<PracticeExercise>({ 
    name: "",
    bpm: 120,
    duration: 25,
    notes: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setCurrent({ ...current, [name]: name === "bpm" || name === "duration" ? +value : value });
  }

  function addExercise() {
    setExercises([...exercises, current]);
    setCurrent({ name: "", bpm: 80, duration: 25, notes: "" });
  }

  async function saveSession() {
    if (!user) {
      alert("Please sign in to save sessions");
      return;
    }

    try {
      setIsSaving(true);
      const session = {
        date: new Date().toISOString(),
        exercises,
        createdAt: serverTimestamp(),
        user_id: user.uid, // ✅ Add user_id for security rules
      };

      console.log('Attempting to save session:', session);
      const docRef = await addDoc(collection(db, 'practice_sessions'), session);
      console.log('Session saved successfully with ID:', docRef.id);

      setExercises([]);
      alert("Session saved successfully!");
    } catch (error) {
      console.error('Detailed error saving session:', error);
      const firebaseError = error as { code?: string; message?: string };
      console.error('Error code:', firebaseError.code);
      console.error('Error message:', firebaseError.message);
      alert(`Failed to save session: ${firebaseError.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="max-w-xl p-4 mx-auto mt-6">
      <CardContent className="space-y-4">
        <h2 className="text-xl font-bold">Log Practice Session</h2>
        <div>
          <Label>Exercise name</Label>
          <Input placeholder="Exercise" name="name" value={current.name} onChange={handleChange} />
        </div>
        <div>
          <Label>BPM</Label>
          <Input type="number" placeholder="BPM" name="bpm" value={current.bpm} onChange={handleChange} />
        </div>
        <div>
          <Label>Minutes practiced</Label>
          <Input type="number" placeholder="Minutes practiced" name="duration" value={current.duration} onChange={handleChange} />
        </div>
        <div>
          <Label>Notes (optional)</Label>
          <Textarea name="notes" value={current.notes} onChange={handleChange} />
        </div>

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
            <Button 
              variant="secondary" 
              onClick={saveSession} 
              className="w-full"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "✅ Save Session"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionLogger;
