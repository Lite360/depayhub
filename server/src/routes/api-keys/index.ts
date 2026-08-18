import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { apiKeyService } from '../../services/ApiKeyService'

const prisma = new PrismaClient()

const generateKeySchema = z.object({
  name: z.string().min(1).max(50),
  scopes: z.array(z.string()).optional()
})

const apiKeyRoutes: FastifyPluginAsync = async (server) => {
  // Protect all API Key management routes with JWT auth
  server.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  // List user's API Keys
  server.get('/', async (request, reply) => {
    const user = request.user as any
    
    // Only fetch Vendor/Admin keys (or allow anyone? PRD implies API is for vendors/devs)
    if (user.role === 'SUBSCRIBER') {
      return reply.status(403).send({ error: 'Only vendors can manage API keys' })
    }
    
    const keys = await prisma.apiKey.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
        scopes: { select: { scope: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return { status: 'success', keys }
  })

  // Generate a new API Key
  server.post('/generate', async (request, reply) => {
    const user = request.user as any
    
    if (user.role === 'SUBSCRIBER') {
      return reply.status(403).send({ error: 'Only vendors can manage API keys' })
    }
    
    const { name, scopes } = generateKeySchema.parse(request.body)
    
    // Optional: Limit number of active keys per user
    const activeKeysCount = await prisma.apiKey.count({
      where: { userId: user.id, isActive: true }
    })
    
    if (activeKeysCount >= 5) {
      return reply.status(400).send({ error: 'Maximum active API keys reached (5)' })
    }
    
    const keyData = await apiKeyService.generateKey(user.id, name, scopes || ['AIRTIME', 'DATA'])
    
    return { 
      status: 'success', 
      message: 'API Key generated. Please save the plaintext key now, it will not be shown again.',
      data: {
        name: keyData.name,
        plaintextKey: keyData.plaintextKey,
        keyPrefix: keyData.keyPrefix
      }
    }
  })

  // Revoke an API Key
  server.delete('/:id', async (request, reply) => {
    const user = request.user as any
    const { id } = request.params as { id: string }
    
    const success = await apiKeyService.revokeKey(user.id, id)
    
    if (!success) {
      return reply.status(404).send({ error: 'API key not found or already revoked' })
    }
    
    return { status: 'success', message: 'API key revoked successfully' }
  })
}

export default apiKeyRoutes
