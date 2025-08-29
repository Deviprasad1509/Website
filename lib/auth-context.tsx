"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { auth } from "./firebase/client"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { db } from "./firebase/client"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "user" | "admin"
  avatar?: string
  createdAt: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true }
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isLoading: false,
        isAuthenticated: true,
      }
    case "LOGIN_FAILURE":
      return {
        user: null,
        isLoading: false,
        isAuthenticated: false,
      }
    case "LOGOUT":
      return {
        user: null,
        isLoading: false,
        isAuthenticated: false,
      }
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }
    default:
      return state
  }
}

const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>
  logout: () => void
} | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
    isAuthenticated: false,
  })

  // Check for existing session on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        await loadUserProfile(fbUser)
      } else {
        dispatch({ type: "LOGOUT" })
      }
    })

    return () => unsubscribe()
  }, [])

  const loadUserProfile = async (authUser: FirebaseUser) => {
    console.log('🔍 Loading profile for user:', authUser.id, authUser.email)
    
    try {
      const ref = doc(db, 'profiles', authUser.uid)
      const snap = await getDoc(ref)

      if (!snap.exists()) {
        const profileData = {
          id: authUser.uid,
          email: authUser.email || '',
          first_name: 'User',
          last_name: 'Name',
          role: 'user' as const,
          avatar_url: null as string | null,
          created_at: serverTimestamp(),
        }
        await setDoc(ref, profileData)
        const user: User = {
          id: profileData.id,
          email: profileData.email,
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          role: profileData.role,
          avatar: undefined,
          createdAt: new Date().toISOString(),
        }
        dispatch({ type: "LOGIN_SUCCESS", payload: user })
        return
      }

      const p = snap.data() as any
      const user: User = {
        id: p.id,
        email: p.email,
        firstName: p.first_name,
        lastName: p.last_name,
        role: p.role,
        avatar: p.avatar_url || undefined,
        createdAt: (p.created_at?.toDate?.() ?? new Date()).toISOString(),
      }
      dispatch({ type: "LOGIN_SUCCESS", payload: user })
    } catch (error) {
      console.error('❌ Exception in loadUserProfile:', error)
      dispatch({ type: "LOGIN_FAILURE" })
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })

    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (error) {
      console.error('Login error:', error)
      dispatch({ type: "LOGIN_FAILURE" })
      return false
    }
  }

  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      const ref = doc(db, 'profiles', cred.user.uid)
      await setDoc(ref, {
        id: cred.user.uid,
        email,
        first_name: firstName,
        last_name: lastName,
        role: 'user',
        avatar_url: null,
        created_at: serverTimestamp(),
      })
      return true
    } catch (error) {
      console.error('Signup error:', error)
      dispatch({ type: "LOGIN_FAILURE" })
      return false
    }
  }

  const logout = async () => {
    await signOut(auth)
    dispatch({ type: "LOGOUT" })
  }

  return <AuthContext.Provider value={{ state, dispatch, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
