import { isFirebaseEnabled } from '../lib/firebase';
import { User } from '../types';

const DUMMY_USER: User = {
  uid: 'dummy-123',
  email: 'awais@gmail.com',
  displayName: 'Awais (Demo)',
  createdAt: new Date().toISOString(),
};

const DEMO_EPISODES = [
  {
    id: 'demo-1',
    userId: 'dummy-123',
    title: 'Future of Agentic AI',
    niche: 'Technology',
    goal: 'Educational',
    tone: 'Professional',
    length: '45 mins',
    format: 'Interview',
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const authService = {
  async login(email: string, pass: string): Promise<User> {
    // Demo account check
    if (email === 'awais@gmail.com' && pass === '123') {
      localStorage.setItem('podcraft_session', JSON.stringify(DUMMY_USER));
      
      // Seed demo data if first login
      if (!localStorage.getItem('podcraft_seeded')) {
        localStorage.setItem('podcraft_episodes', JSON.stringify(DEMO_EPISODES));
        localStorage.setItem('podcraft_seeded', 'true');
      }
      
      return DUMMY_USER;
    }
    
    if (isFirebaseEnabled) {
      // Real firebase auth implementation would go here
      throw new Error('Real auth not fully implemented yet. Use dummy account.');
    } else {
      throw new Error('Invalid credentials');
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem('podcraft_session');
  },

  getCurrentUser(): User | null {
    const session = localStorage.getItem('podcraft_session');
    return session ? JSON.parse(session) : null;
  }
};
