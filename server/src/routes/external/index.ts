import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { apiKeyService } from '../../services/ApiKeyService'
import { providerManager } from '../../providers/ProviderManager'

const prisma = new PrismaClient()

const externalApiRoutes: FastifyPluginAsync = async (server) => {
  
  // API Key Authentication Middleware
  server.addHook('preHandler', async (request, reply) => {
    const authHeader = request.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Missing or invalid Authorization header' })
    }
    
    const token = authHeader.replace('Bearer ', '')
    const verifyResult = await apiKeyService.verifyKey(token)
    
    if (!verifyResult.valid) {
      return reply.status(401).send({ error: 'Invalid or revoked API Key' })
    }
    
    // Attach user and scopes to request for downstream handlers
    ;(request as any).apiUser = {
      id: verifyResult.userId,
      apiKeyId: verifyResult.apiKeyId,
      scopes: verifyResult.scopes
    }
    
    // Log API Usage
    await prisma.apiUsage.create({
      data: {
        apiKeyId: verifyResult.apiKeyId!,
        endpoint: request.routeOptions.url ?? request.url,
        method: request.method,
        statusCode: 200, // Will update at the end ideally
        ip: request.ip
      }
    }).catch(console.error)
  })

  // Middleware to check scopes
  const requireScope = (scope: string) => {
    return async (request: any, reply: any) => {
      const { scopes } = request.apiUser
      if (!scopes.includes(scope)) {
        return reply.status(403).send({ error: `Missing required scope: ${scope}` })
      }
    }
  }

  const purchaseSchema = z.object({
    phone: z.string(),
    amount: z.number().optional(), // required for dynamic airtime
    planCode: z.string().optional(), // required for data
    reference: z.string().optional() // client's custom reference
  })

  // Purchase Airtime via API
  server.post('/airtime', { preHandler: requireScope('AIRTIME') }, async (request, reply) => {
    const { phone, amount, reference: clientReference } = purchaseSchema.parse(request.body)
    const { id: userId } = (request as any).apiUser
    
    if (!amount) {
      return reply.status(400).send({ error: 'Amount is required for Airtime' })
    }
    
    // Simulate finding the pricing for the API user
    // For MVP, we mock the apiPrice deduction logic
    const finalPrice = amount * 0.95 // 5% discount for API
    const reference = clientReference || `API-TXN-${Date.now()}`
    
    try {
      // 1. Atomic Wallet Deduction
      const transactionRecord = await prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({ where: { userId } })
        if (!wallet || Number(wallet.cachedBalance) < finalPrice) {
          throw new Error('Insufficient wallet balance')
        }
        
        const newBalance = Number(wallet.cachedBalance) - finalPrice
        
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { cachedBalance: newBalance }
        })
        
        const transaction = await tx.transaction.create({
          data: {
            userId,
            reference,
            service: 'AIRTIME',
            provider: 'MOCK_VTU',
            amount: finalPrice,
            providerCost: amount * 0.90, // mock base cost
            status: 'PROCESSING'
          }
        })
        
        return transaction
      })
      
      // 2. Execute Provider Logic
      const provider = providerManager.getProvider('MOCK_VTU')
      const result = await provider.purchaseAirtime(phone, amount, reference)
      
      // 3. Handle Result
      if (result.success) {
        await prisma.transaction.update({
          where: { id: transactionRecord.id },
          data: { status: 'SUCCESSFUL', providerReference: result.providerReference }
        })
        
        return reply.send({
          status: 'success',
          message: 'Airtime purchase successful',
          data: {
            phone,
            amount,
            chargedAmount: finalPrice,
            reference,
            providerReference: result.providerReference
          }
        })
      } else {
        // Mock refund logic
        await prisma.$transaction(async (tx) => {
          await tx.transaction.update({
            where: { id: transactionRecord.id },
            data: { status: 'FAILED' }
          })
          const wallet = await tx.wallet.findUnique({ where: { userId } })
          await tx.wallet.update({
            where: { id: wallet!.id },
            data: { cachedBalance: Number(wallet!.cachedBalance) + finalPrice }
          })
        })
        return reply.status(400).send({ error: 'Transaction failed at provider' })
      }
    } catch (err: any) {
      return reply.status(400).send({ error: err.message })
    }
  })
}

export default externalApiRoutes
