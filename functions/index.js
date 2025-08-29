const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const admin = require('firebase-admin')

if (!admin.apps.length) {
  admin.initializeApp()
}

function extractBearerToken(req) {
  const authHeader = req.headers.authorization || ''
  const fromHeader = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : null
  const fromCookie = (req.cookies && req.cookies.__session) || null
  const fromQuery = (req.query && req.query.token) || null
  return fromHeader || fromCookie || fromQuery || null
}

function signSupabaseJwt({ uid, email, secret }) {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: uid,
    email: email || '',
    role: 'authenticated',
    aud: 'authenticated',
    iat: now,
    exp: now + 60 * 60,
  }
  return jwt.sign(payload, secret, { algorithm: 'HS256' })
}

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.get('/api/protected', async (req, res) => {
  try {
    const supabaseSecret = process.env.SUPABASE_JWT_SECRET || (functions.config().supabase && functions.config().supabase.jwt_secret)
    if (!supabaseSecret) throw new Error('SUPABASE_JWT_SECRET not set')

    const idToken = extractBearerToken(req)
    if (!idToken) return res.status(401).json({ error: 'Missing Firebase ID token' })

    const decoded = await admin.auth().verifyIdToken(idToken, true)

    const supabaseToken = signSupabaseJwt({ uid: decoded.uid, email: decoded.email, secret: supabaseSecret })

    return res.json({
      ok: true,
      supabaseTokenIssued: Boolean(supabaseToken),
      uid: decoded.uid,
      email: decoded.email || null,
      supabaseToken,
    })
  } catch (err) {
    console.error('[api/protected] error:', err)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
})

exports.api = functions
  .runWith({ secrets: ['SUPABASE_JWT_SECRET'] })
  .https.onRequest(app)


