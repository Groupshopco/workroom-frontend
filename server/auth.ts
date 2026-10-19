import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { MongoClient } from 'mongodb'

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const mongoDbName = process.env.MONGODB_DB_NAME || 'sgrid'

const mongoClient = new MongoClient(mongoUri)
await mongoClient.connect()

const db = mongoClient.db(mongoDbName)

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: mongoClient,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 7,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  trustedOrigins: ['http://localhost:5173'],
})
