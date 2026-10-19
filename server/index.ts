import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth'

const app = express()
const port = Number(process.env.AUTH_SERVER_PORT || 3000)

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)

app.all('/api/auth/*splat', toNodeHandler(auth))

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.listen(port, () => {
  console.log(`Auth server running on http://localhost:${port}`)
})
