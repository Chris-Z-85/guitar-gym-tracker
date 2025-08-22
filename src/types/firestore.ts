import { Timestamp } from 'firebase/firestore'

// Firestore document types
export interface PracticeItem {
  id: string
  name: string
  user_id: string
  created_at: string | Timestamp
}

export interface PracticeSession {
  id: string
  date: string
  exercises: PracticeExercise[]
  createdAt?: Timestamp
  user_id?: string
}

export interface PracticeExercise {
  name: string
  bpm: number
  duration: number
  notes?: string
}

// For creating new documents
export interface NewPracticeItem {
  name: string
  user_id: string
  created_at?: Timestamp
}

export interface NewPracticeSession {
  date: string
  exercises: PracticeExercise[]
  createdAt?: Timestamp
  user_id?: string
}
