import { db, isFirebaseEnabled } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';
import { PodcastProfile } from '../types';

const STORAGE_KEY = 'podcraft_profiles';

export const profileService = {
  async getByUserId(userId: string): Promise<PodcastProfile | null> {
    if (isFirebaseEnabled && db) {
      const q = query(collection(db, 'profiles'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const d = snapshot.docs[0];
      return { id: d.id, ...d.data() } as PodcastProfile;
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      const profiles: PodcastProfile[] = stored ? JSON.parse(stored) : [];
      return profiles.find(p => p.userId === userId) || null;
    }
  },

  async create(profile: Omit<PodcastProfile, 'id' | 'createdAt'>): Promise<string> {
    const now = new Date().toISOString();
    if (isFirebaseEnabled && db) {
      const docRef = await addDoc(collection(db, 'profiles'), {
        ...profile,
        createdAt: now,
      });
      return docRef.id;
    } else {
      const id = Math.random().toString(36).substring(2, 9);
      const newProfile: PodcastProfile = { ...profile, id, createdAt: now };
      const stored = localStorage.getItem(STORAGE_KEY);
      const profiles: PodcastProfile[] = stored ? JSON.parse(stored) : [];
      profiles.push(newProfile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
      return id;
    }
  },

  async update(id: string, updates: Partial<PodcastProfile>): Promise<void> {
    if (isFirebaseEnabled && db) {
      const docRef = doc(db, 'profiles', id);
      await updateDoc(docRef, updates);
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      let profiles: PodcastProfile[] = stored ? JSON.parse(stored) : [];
      profiles = profiles.map(p => p.id === id ? { ...p, ...updates } : p);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    }
  }
};
