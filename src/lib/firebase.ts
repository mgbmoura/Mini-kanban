// Arquivo placeholder para evitar erros no Preview do Studio.
// Não faz parte da entrega do desafio Teia Connect.
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForPreviewPurposesOnly",
  authDomain: "placeholder.firebaseapp.com",
  projectId: "placeholder",
};

if (typeof window !== 'undefined' && !getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = undefined;
export const db = undefined;
export const storage = undefined;
