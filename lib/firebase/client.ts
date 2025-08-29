import { initializeApp, getApps } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAbHnm5PrNA0ObwtO3w0LuEtA4ianPKDU4",
  authDomain: "buisbuz-ebook-store-2025-aa12f.firebaseapp.com",
  projectId: "buisbuz-ebook-store-2025-aa12f",
  storageBucket: "buisbuz-ebook-store-2025-aa12f.firebasestorage.app",
  messagingSenderId: "552046734488",
  appId: "1:552046734488:web:4e6a8777dbb7452c30b4ed",
  measurementId: "G-FYMSE0K3RT"
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const auth = getAuth(app)
// Ensure auth persistence to avoid login loops on static hosting
setPersistence(auth, browserLocalPersistence).catch(() => {})
export const db = getFirestore(app)
export const storage = getStorage(app)


