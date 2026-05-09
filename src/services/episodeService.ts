import { auth, db, isFirebaseEnabled } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { Episode } from '../types';

const STORAGE_KEY = 'podcraft_episodes';

export const episodeService = {
  async getAll(userId: string): Promise<Episode[]> {
    if (isFirebaseEnabled && db) {
      const q = query(
        collection(db, 'episodes'), 
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Episode));
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      const episodes: Episode[] = stored ? JSON.parse(stored) : [];
      return episodes
        .filter(e => e.userId === userId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
  },

  async getById(id: string): Promise<Episode | null> {
    if (isFirebaseEnabled && db) {
      const docRef = doc(db, 'episodes', id);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Episode) : null;
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      const episodes: Episode[] = stored ? JSON.parse(stored) : [];
      return episodes.find(e => e.id === id) || null;
    }
  },

  async create(episode: Omit<Episode, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString();
    if (isFirebaseEnabled && db) {
      const docRef = await addDoc(collection(db, 'episodes'), {
        ...episode,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } else {
      const id = Math.random().toString(36).substring(2, 9);
      const newEpisode: Episode = {
        ...episode,
        id,
        createdAt: now,
        updatedAt: now,
      };
      const stored = localStorage.getItem(STORAGE_KEY);
      const episodes: Episode[] = stored ? JSON.parse(stored) : [];
      episodes.push(newEpisode);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(episodes));
      return id;
    }
  },

  async update(id: string, updates: Partial<Episode>): Promise<void> {
    const now = new Date().toISOString();
    if (isFirebaseEnabled && db) {
      const docRef = doc(db, 'episodes', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: now,
      });
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      let episodes: Episode[] = stored ? JSON.parse(stored) : [];
      episodes = episodes.map(e => e.id === id ? { ...e, ...updates, updatedAt: now } : e);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(episodes));
    }
  },

  async delete(id: string): Promise<void> {
    if (isFirebaseEnabled && db) {
      await deleteDoc(doc(db, 'episodes', id));
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      let episodes: Episode[] = stored ? JSON.parse(stored) : [];
      episodes = episodes.filter(e => e.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(episodes));
    }
  }
};
