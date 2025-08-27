import { db } from '@/components/firebaseClient';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import type { PracticeItem, NewPracticeItem } from '@/types/firestore';

export async function fetchPracticeItems(
  userId: string
): Promise<PracticeItem[]> {
  try {
    console.log('Fetching practice items for user:', userId);

    // Remove orderBy to avoid composite index requirement
    const q = query(
      collection(db, 'practice_items'),
      where('user_id', '==', userId)
    );

    const snap = await getDocs(q);
    console.log(
      'Practice items query result:',
      snap.docs.length,
      'items found'
    );

    const items = snap.docs.map(d => {
      const v = d.data() as {
        name: string;
        user_id: string;
        created_at?: Timestamp | string;
      };
      const createdAtIso =
        v.created_at instanceof Timestamp
          ? v.created_at.toDate().toISOString()
          : (v.created_at ?? new Date().toISOString());
      return {
        id: d.id,
        name: v.name,
        user_id: v.user_id,
        created_at: createdAtIso,
      };
    });

    // Sort in memory instead of in query
    return items.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  } catch (error) {
    console.error('Error fetching practice items:', error);
    const firebaseError = error as { code?: string; message?: string };
    console.error('Firebase error code:', firebaseError.code);
    console.error('Firebase error message:', firebaseError.message);
    throw new Error(
      `Failed to fetch practice items: ${firebaseError.message || 'Unknown error'}`
    );
  }
}

export async function addPracticeItem(
  item: NewPracticeItem
): Promise<PracticeItem> {
  const ref = await addDoc(collection(db, 'practice_items'), {
    name: item.name,
    user_id: item.user_id,
    created_at: Timestamp.fromDate(new Date()),
  });
  // Return shape compatible with existing usage
  return {
    id: ref.id,
    name: item.name,
    user_id: item.user_id,
    created_at: new Date().toISOString(),
  };
}

export async function deletePracticeItem(id: string) {
  await deleteDoc(doc(db, 'practice_items', id));
}
