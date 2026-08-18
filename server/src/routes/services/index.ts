import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import * as argon2 from 'argon2'
import { PrismaClient } from '@prisma/client'
import { providerManager } from '../../providers/ProviderManager'

const prisma = new PrismaClient()

const purchaseSchema = z.object({
  serviceCategory: z.string(), // e.g., 'AIRTIME'
  planCode: z.string(),        // e.g., 'mtn-airtime' or 'mtn-1gb'
  phone: z.string(),
  amount: z.number().optional(), // required for airtime
  pin: z.string().length(4)      // Transaction PIN
})

const serviceRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  // Get dynamic pricing based on user role
  server.get('/', async (request, reply) => {
    const user = request.user as any
    const role = user.role // SUBSCRIBER, VENDOR, ADMIN
    
    // Fetch active service categories, plans, and their lowest pricing
    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      include: {
        plans: {
          where: { isActive: true },
          include: {
            pricingTiers: {
              where: { isActive: true },
              include: { provider: true }
            }
          }
        }
      }
    })
    
    // Format response to hide provider logic from frontend and show correct price
    const formattedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      plans: cat.plans.map(plan => {
        // Find the active pricing tier (e.g., primary provider)
        const activePricing = plan.pricingTiers[0] 
        
        let price = activePricing?.subscriberPrice
        if (role === 'VENDOR') price = activePricing?.vendorPrice
        if (role === 'ADMIN') price = activePricing?.providerCost // Admins can see cost
        
        return {
          id: plan.id,
          name: plan.name,
          code: plan.code,
          network: plan.network,
          price: price
        }
      })
    }))
    
    return { status: 'success', data: formattedCategories }
  })

  server.post('/purchase', async (request, reply) => {
    const user = request.user as any
    const { serviceCategory, planCode, phone, amount, pin } = purchaseSchema.parse(request.body)
    const meterNumber = phone // alias for electricity
    const network = planCode // alias for data pin
    
    // 0. Verify Transaction PIN
    const currentUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!currentUser) return reply.status(404).send({ error: 'User not found' })
    
    const isPinValid = await argon2.verify(currentUser.pinHash, pin)
    if (!isPinValid) {
      return reply.status(401).send({ error: 'Invalid transaction PIN' })
    }
    
    // 1. Find the plan and its pricing
    const plan = await prisma.servicePlan.findUnique({
      where: { code: planCode },
      include: {
        pricingTiers: {
          where: { isActive: true },
          include: { provider: true }
        }
      }
    })
    
    if (!plan || plan.pricingTiers.length === 0) {
      return reply.status(400).send({ error: 'Service plan not found or unavailable' })
    }
    
    // Default to first active provider pricing
    const pricing = plan.pricingTiers[0]
    
    // Determine exact cost based on role and fixed/dynamic amount
    let finalPrice = Number(pricing.subscriberPrice)
    if (user.role === 'VENDOR') finalPrice = Number(pricing.vendorPrice)
    
    // If it's dynamic airtime, price is usually the face value, but we might have a discount
    // For simplicity in MVP, if amount is passed (like airtime), we charge exactly the amount requested minus discount
    // Assuming subscriberPrice is a percentage multiplier for dynamic airtime (e.g. 0.98 for 2% discount)
    if (serviceCategory === 'AIRTIME' && amount) {
      finalPrice = amount * Number(pricing.subscriberPrice)
    }
    
    const reference = `TXN-${Date.now()}`

    // 2. Perform Atomic Wallet Deduction & Transaction creation
    let transactionRecord;
    try {
      transactionRecord = await prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({ where: { userId: user.id } })
        if (!wallet || Number(wallet.cachedBalance) < finalPrice) {
          throw new Error('Insufficient funds')
        }
        
        const newBalance = Number(wallet.cachedBalance) - finalPrice
        
        // Update balance
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { cachedBalance: newBalance }
        })
        
        // Create Transaction History
        const transaction = await tx.transaction.create({
          data: {
            userId: user.id,
            reference,
            service: serviceCategory,
            provider: pricing.provider.name,
            amount: finalPrice,
            providerCost: serviceCategory === 'AIRTIME' && amount ? amount * Number(pricing.providerCost) : pricing.providerCost,
            status: 'PROCESSING'
          }
        })
        
        // Create Ledger Entry
        const walletTx = await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: 'DEBIT',
            amount: finalPrice,
            reference: `DEBIT-${reference}`,
            description: `Purchase of ${plan.name} for ${phone}`
          }
        })
        
        await tx.ledgerEntry.create({
          data: {
            walletTransactionId: walletTx.id,
            amount: finalPrice,
            balanceAfter: newBalance
          }
        })
        
        return transaction
      })
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || 'Transaction failed during initialization' })
    }
    
    // 3. Call Provider (External API)
    const provider = providerManager.getProvider(pricing.provider.name)
    let providerResult;
    
    if (serviceCategory === 'AIRTIME') {
      providerResult = await provider.purchaseAirtime(phone, amount!, reference)
    } else if (serviceCategory === 'ELECTRICITY') {
      providerResult = await provider.purchaseElectricity(meterNumber, finalPrice, reference)
    } else if (serviceCategory === 'DATA_PIN') {
      providerResult = await provider.purchaseDataPin(network, finalPrice, reference)
    } else {
      providerResult = await provider.purchaseData(phone, planCode, reference)
    }
    
    // 4. Handle Provider Response
    if (providerResult.success) {
      await prisma.transaction.update({
        where: { id: transactionRecord.id },
        data: { 
          status: 'SUCCESSFUL', 
          providerReference: providerResult.providerReference 
        }
      })
      
      // Extract extra info for receipt (e.g. token or pin)
      const extraInfo = (providerResult as any).token || (providerResult as any).pin || ''
      const receiptItemName = extraInfo ? `${plan.name} (${extraInfo})` : plan.name
      
      // Generate Receipt
      await prisma.receipt.create({
        data: {
          userId: user.id,
          reference: `REC-${reference}`,
          service: serviceCategory,
          totalAmount: finalPrice,
          fee: 0,
          status: 'SUCCESSFUL',
          items: {
            create: [
              { name: receiptItemName, amount: finalPrice }
            ]
          }
        }
      })
      
      return reply.send({ status: 'success', message: 'Transaction successful', reference, extraInfo })
    } else {
      // 5. Fail and Refund (Reversal)
      await prisma.$transaction(async (tx) => {
        await tx.transaction.update({
          where: { id: transactionRecord.id },
          data: { status: 'FAILED' }
        })
        
        const wallet = await tx.wallet.findUnique({ where: { userId: user.id } })
        const restoredBalance = Number(wallet!.cachedBalance) + finalPrice
        
        await tx.wallet.update({
          where: { id: wallet!.id },
          data: { cachedBalance: restoredBalance }
        })
        
        const refundTx = await tx.walletTransaction.create({
          data: {
            walletId: wallet!.id,
            type: 'CREDIT',
            amount: finalPrice,
            reference: `REFUND-${reference}`,
            description: `Refund for failed purchase of ${plan.name}`
          }
        })
        
        await tx.ledgerEntry.create({
          data: {
            walletTransactionId: refundTx.id,
            amount: finalPrice,
            balanceAfter: restoredBalance
          }
        })
      })
      
      return reply.status(400).send({ error: 'Provider failed to process transaction, wallet refunded.' })
    }
  })
}

export default serviceRoutes
