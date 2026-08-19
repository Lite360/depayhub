import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth'
import walletRoutes from './routes/wallet'
import adminRoutes from './routes/admin'
import serviceRoutes from './routes/services'
import vendorRoutes from './routes/vendor'
import receiptRoutes from './routes/receipts'
import apiKeyRoutes from './routes/api-keys'
import externalApiRoutes from './routes/external'

const prisma = new PrismaClient()

export function buildApp() {
  const server = fastify({ logger: process.env.NODE_ENV !== 'production' })

  // Register plugins
  server.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  server.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret'
  })

  // Basic health check
  server.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  // Register custom routes
  server.register(authRoutes, { prefix: '/api/auth' })
  server.register(walletRoutes, { prefix: '/api/wallet' })
  server.register(adminRoutes, { prefix: '/api/admin' })
  server.register(serviceRoutes, { prefix: '/api/services' })
  server.register(vendorRoutes, { prefix: '/api/vendor' })
  server.register(receiptRoutes, { prefix: '/api/receipts' })
  server.register(apiKeyRoutes, { prefix: '/api/keys' })
  server.register(externalApiRoutes, { prefix: '/api/v1' })

  return server
}

export { prisma }
