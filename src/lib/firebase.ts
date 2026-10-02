import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBNwR30UBzwWuBnddyXmc9q1pw0Yd0L8Zo",
  authDomain: "gen-lang-client-0303185883.firebaseapp.com",
  projectId: "gen-lang-client-0303185883",
  storageBucket: "gen-lang-client-0303185883.firebasestorage.app",
  messagingSenderId: "269585182383",
  appId: "1:269585182383:web:44ee7ab40528fc27842e5a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-agamakizhiasacad-5530b6e7-3488-4b1b-845e-d85d73e170ad");
export const auth = getAuth(app);
