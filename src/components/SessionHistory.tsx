import React, { useState, useEffect } from 'react';
import { supabase } from "@/components/supabaseClient.ts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PracticeExercise {
  name: string;
  bpm: number;
  duration: number;  // duration in seconds
  notes?: string;
}

interface Session {
  id: number;
  date: string;
  exercises: PracticeExercise[];
}

const SessionHistory: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  };

  // Load sessions from Supabase on component mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('practice_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSessions(prevSessions => prevSessions.filter(session => session.id !== id));
    } catch (err) {
      console.error('Error deleting session:', err);
      alert('Failed to delete session. Please try again.');
    }
  };

  if (loading) return <div>Loading sessions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="max-w-xl p-4 mx-auto mt-6">
      <CardContent>
        <h2 className="mb-4 text-xl font-bold">Session History</h2>
        {sessions.length === 0 ? (
          <p>No practice sessions recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map(session => (
              <Card key={session.id} className="p-4">
                <h3 className="font-semibold">
                  {new Date(session.date).toLocaleDateString()}
                </h3>
                <ul className="mt-2 space-y-2">
                  {session.exercises.map((exercise, idx) => (
                    <li key={idx} className="text-sm">
                      {exercise.name} — {exercise.bpm} BPM — {formatDuration(exercise.duration)}
                      {exercise.notes && (
                        <p className="mt-1 text-gray-500">Notes: {exercise.notes}</p>
                      )}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(session.id)}
                  className="mt-2"
                >
                  Delete Session
                </Button>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionHistory;
