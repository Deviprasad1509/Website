"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { createClient } from "./supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { Database } from "./database.types"

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

  const supabase = createClient()

  // Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserProfile(session.user)
      }
    }

    getSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user)
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: "LOGOUT" })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (authUser: SupabaseUser) => {
    console.log('🔍 Loading profile for user:', authUser.id, authUser.email)
    console.log('🔍 Auth user metadata:', authUser.user_metadata)
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      console.log('📊 Profile query result:', { profile, error })
      console.log('📊 Profile role specifically:', profile?.role)

      if (error) {
        console.error('❌ Error loading profile:', error)
        
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116') { // Not found error
          console.log('🆕 Profile not found, creating new profile...')
          
          const profileData = {
            id: authUser.id,
            email: authUser.email || '',
            first_name: authUser.user_metadata?.first_name || 'User',
            last_name: authUser.user_metadata?.last_name || 'Name',
            role: 'user' as const
          }
          
          console.log('📝 Creating profile with data:', profileData)
          
          try {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert(profileData)
              .select()
              .single()

            console.log('🔄 Profile creation result:', { newProfile, createError })

            if (createError) {
              console.error('❌ Error creating profile:', createError)
              dispatch({ type: "LOGIN_FAILURE" })
              return
            }

            if (newProfile) {
              console.log('✅ Profile created successfully:', newProfile)
              const user: User = {
                id: newProfile.id,
                email: newProfile.email,
                firstName: newProfile.first_name,
                lastName: newProfile.last_name,
                role: newProfile.role,
                avatar: newProfile.avatar_url || undefined,
                createdAt: newProfile.created_at,
              }
              dispatch({ type: "LOGIN_SUCCESS", payload: user })
              return
            }
          } catch (createErr) {
            console.error('❌ Exception creating profile:', createErr)
          }
        }
        
        dispatch({ type: "LOGIN_FAILURE" })
        return
      }

      if (profile) {
        console.log('✅ Profile loaded successfully:', profile)
        const user: User = {
          id: profile.id,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          role: profile.role,
          avatar: profile.avatar_url || undefined,
          createdAt: profile.created_at,
        }
        dispatch({ type: "LOGIN_SUCCESS", payload: user })
      }
    } catch (error) {
      console.error('❌ Exception in loadUserProfile:', error)
      dispatch({ type: "LOGIN_FAILURE" })
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error)
        dispatch({ type: "LOGIN_FAILURE" })
        return false
      }

      if (data.user) {
        // Profile will be loaded automatically by the auth state change listener
        return true
      }

      dispatch({ type: "LOGIN_FAILURE" })
      return false
    } catch (error) {
      console.error('Login error:', error)
      dispatch({ type: "LOGIN_FAILURE" })
      return false
    }
  }

  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      })

      if (error) {
        console.error('Signup error:', error)
        dispatch({ type: "LOGIN_FAILURE" })
        return false
      }

      if (data.user) {
        // Manual profile creation as fallback if trigger doesn't work
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email || email,
              first_name: firstName,
              last_name: lastName,
              role: 'user'
            })

          if (profileError) {
            console.error('Profile creation error:', profileError)
            // Don't fail signup if profile creation fails, trigger might have handled it
          }
        } catch (profileErr) {
          console.error('Profile creation error:', profileErr)
          // Don't fail signup if profile creation fails
        }

        // User will be logged in automatically after email confirmation
        // For now, we'll treat signup as successful even if email confirmation is pending
        return true
      }

      dispatch({ type: "LOGIN_FAILURE" })
      return false
    } catch (error) {
      console.error('Signup error:', error)
      dispatch({ type: "LOGIN_FAILURE" })
      return false
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
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
