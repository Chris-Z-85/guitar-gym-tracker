import React, { useState, useEffect } from 'react';

interface Session {
  id: string;
  title: string;
  createdAt: string;
}

const SessionHistory: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');

  // Load sessions from localStorage on component mount
  useEffect(() => {
    const storedSessions = localStorage.getItem('sessions');
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
  }, []);

  // Save sessions to localStorage whenever sessions state changes
  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditedTitle(currentTitle);
  };

  const handleSave = (id: string) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === id ? { ...session, title: editedTitle } : session
      )
    );
    setEditingId(null);
    setEditedTitle('');
  };

  const handleDelete = (id: string) => {
    setSessions(prevSessions => prevSessions.filter(session => session.id !== id));
  };

  return (
    <div>
      <h2>Session History</h2>
      <ul>
        {sessions.map(session => (
          <li key={session.id}>
            {editingId === session.id ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={e => setEditedTitle(e.target.value)}
                />
                <button onClick={() => handleSave(session.id)}>Save</button>
              </>
            ) : (
              <>
                <span>{session.title}</span>
                <button onClick={() => handleEdit(session.id, session.title)}>Edit</button>
              </>
            )}
            <button onClick={() => handleDelete(session.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionHistory;
