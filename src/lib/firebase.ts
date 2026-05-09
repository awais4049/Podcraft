import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Export variables that can be checked for availability
export let auth: any = null;
export let db: any = null;
export let isFirebaseEnabled = false;

async function initFirebase() {
  try {
    const response = await fetch('/firebase-applet-config.json').catch(() => null);
    if (response && response.ok) {
      const config = await response.json();
      if (getApps().length === 0) {
        const app = initializeApp(config);
        auth = getAuth(app);
        if (config.firestoreDatabaseId) {
          db = getFirestore(app, config.firestoreDatabaseId);
        } else {
          db = getFirestore(app);
        }
        isFirebaseEnabled = true;
      }
    }
  } catch (e) {
    console.warn('Firebase initialization failed:', e);
  }
}

// Start initialization but don't block module load
initFirebase();
