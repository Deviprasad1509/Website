import * as functions from 'firebase-functions'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { supabaseAuthBridge } from './middleware/supabaseAuthBridge'

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Protected example route with Supabase token available
app.get('/api/protected', supabaseAuthBridge, async (req, res) => {
  res.json({
    ok: true,
    supabaseTokenIssued: Boolean(req.supabaseToken),
    uid: req.firebaseUser?.uid,
    email: req.firebaseUser?.email ?? null,
  })
})

export const api = functions.https.onRequest(app)


