import { initializeApp } from "firebase/app";
import {
  doc,
  getDoc,
  getFirestore,
  increment,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6ActchykDGyxENBJHb_MtHfdEaJk8Oy8",
  authDomain: "rds-school-app.firebaseapp.com",
  projectId: "rds-school-app",
  storageBucket: "rds-school-app.firebasestorage.app",
  messagingSenderId: "644286283262",
  appId: "1:644286283262:web:c7fccd89a6e3d9416554af",
  measurementId: "G-RB3MLTM06K",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const ANALYTICS_DOC = doc(db, "websiteStats", "analytics");

/** Increment visitors by +1 when the page loads (once per session). */
export async function incrementVisitors(): Promise<void> {
  try {
    await setDoc(ANALYTICS_DOC, { visitors: increment(1) }, { merge: true });
  } catch {
    // silently ignore — Firestore unavailable
  }
}

/** Increment likes by +1 when the Like button is clicked. */
export async function incrementLikes(): Promise<number> {
  try {
    await setDoc(ANALYTICS_DOC, { likes: increment(1) }, { merge: true });
    const snap = await getDoc(ANALYTICS_DOC);
    return (snap.data()?.likes as number) ?? 0;
  } catch {
    return 0;
  }
}

/** Fetch current likes and visitors counts from Firestore. */
export async function getAnalytics(): Promise<{
  likes: number;
  visitors: number;
}> {
  try {
    const snap = await getDoc(ANALYTICS_DOC);
    const data = snap.data();
    return {
      likes: (data?.likes as number) ?? 0,
      visitors: (data?.visitors as number) ?? 0,
    };
  } catch {
    return { likes: 0, visitors: 0 };
  }
}
