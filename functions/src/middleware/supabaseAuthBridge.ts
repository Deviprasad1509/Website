import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import admin from 'firebase-admin'

declare global {
  namespace Express {
    interface Request {
      supabaseToken?: string
      firebaseUser?: admin.auth.DecodedIdToken
    }
  }
}

if (!admin.apps.length) {
  admin.initializeApp()
}

function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization || ''
  const fromHeader = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : null

  const fromCookie = (req.cookies && (req.cookies.__session as string)) || null
  const fromQuery = (req.query && (req.query.token as string)) || null
  return fromHeader || fromCookie || fromQuery || null
}

function signSupabaseJwt(opts: { uid: string; email?: string; secret: string }): string {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: opts.uid,
    email: opts.email ?? '',
    role: 'authenticated',
    aud: 'authenticated',
    iat: now,
    exp: now + 60 * 60,
  }
  return jwt.sign(payload, opts.secret, { algorithm: 'HS256' })
}

export async function supabaseAuthBridge(req: Request, res: Response, next: NextFunction) {
  try {
    const supabaseSecret = process.env.SUPABASE_JWT_SECRET
    if (!supabaseSecret) throw new Error('SUPABASE_JWT_SECRET not set')

    const idToken = extractBearerToken(req)
    if (!idToken) return res.status(401).json({ error: 'Missing Firebase ID token' })

    const decoded = await admin.auth().verifyIdToken(idToken, true)
    req.firebaseUser = decoded

    const supabaseToken = signSupabaseJwt({ uid: decoded.uid, email: decoded.email, secret: supabaseSecret })
    req.supabaseToken = supabaseToken

    return next()
  } catch (err) {
    console.error('[supabaseAuthBridge] error:', err)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}


