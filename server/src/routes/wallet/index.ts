import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Validation schemas
const generateAccountSchema = z.object({
  provider: z.enum(['PAYMENTPOINT', 'ASPIFY'])
})

const webhookSchema = z.object({
  reference: z.string(),
  amount: z.number(),
  accountNumber: z.string(),
  status: z.string()
})

const walletRoutes: FastifyPluginAsync = async (server) => {
  // Middleware to require authentication (mocked for now, assumes request.user is set)
  server.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      if (request.routeOptions.url !== '/api/wallet/webhook') {
        reply.send(err)
      }
    }
  })

  // Get current user's wallet balance
  server.get('/balance', async (request, reply) => {
    const user = request.user as any
    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id }
    })
    
    if (!wallet) {
      return reply.status(404).send({ error: 'Wallet not found' })
    }
    
    return { status: 'success', balance: Number(wallet.cachedBalance) }
  })

  server.get('/transactions', async (request, reply) => {
    const user = request.user as any
    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } })
    if (!wallet) return { status: 'success', transactions: [] }
    
    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' }
    })
    
    return { status: 'success', transactions }
  })

  server.post('/fund/generate', async (request, reply) => {
    const user = request.user as any
    const { provider } = generateAccountSchema.parse(request.body)
    
    // Check if account already exists
    let account = await prisma.fundingAccount.findUnique({
      where: { userId_provider: { userId: user.id, provider } }
    })
    
    if (!account) {
      // Mock calling Provider API to generate account
      const mockAccountNumber = provider === 'PAYMENTPOINT' ? `80${Math.floor(Math.random() * 100000000)}` : `90${Math.floor(Math.random() * 100000000)}`
      const mockBankName = provider === 'PAYMENTPOINT' ? 'PalmPay' : 'Paga'
      
      account = await prisma.fundingAccount.create({
        data: {
          userId: user.id,
          provider,
          accountNumber: mockAccountNumber,
          accountName: 'Depayhub - ' + user.id.substring(0, 8),
          bankName: mockBankName
        }
      })
    }
    
    return { status: 'success', account }
  })

  server.post('/webhooks/:provider', async (request, reply) => {
    const { provider } = request.params as { provider: string }
    const providerUpper = provider.toUpperCase()
    
    try {
      // 1. Validate payload
      const payload = webhookSchema.parse(request.body)
      
      // 2. Idempotency Check
      const existingWebhook = await prisma.paymentWebhook.findUnique({
        where: { providerReference: payload.reference }
      })
      
      if (existingWebhook) {
        // Already processed or pending, ignore and return 200
        return reply.status(200).send({ status: 'ignored', message: 'Webhook already received' })
      }
      
      // 3. Save Webhook as PENDING
      const webhook = await prisma.paymentWebhook.create({
        data: {
          provider: providerUpper,
          providerReference: payload.reference,
          payload: request.body as any,
          status: 'PENDING'
        }
      })
      
      if (payload.status !== 'SUCCESS') {
        await prisma.paymentWebhook.update({
          where: { id: webhook.id },
          data: { status: 'IGNORED' }
        })
        return reply.status(200).send({ status: 'ignored', message: 'Transaction not successful' })
      }
      
      // 4. Find Funding Account and associated Wallet
      const account = await prisma.fundingAccount.findFirst({
        where: { accountNumber: payload.accountNumber, provider: providerUpper },
        include: { user: { include: { wallet: true } } }
      })
      
      if (!account || !account.user.wallet) {
        await prisma.paymentWebhook.update({
          where: { id: webhook.id },
          data: { status: 'FAILED' }
        })
        return reply.status(200).send({ status: 'failed', message: 'Account or wallet not found' })
      }
      
      // 5. Atomic Ledger Credit
      await prisma.$transaction(async (tx) => {
        const amountToCredit = payload.amount
        const currentBalance = Number(account.user.wallet!.cachedBalance)
        const newBalance = currentBalance + amountToCredit
        
        // Create wallet transaction
        const walletTx = await tx.walletTransaction.create({
          data: {
            walletId: account.user.wallet!.id,
            type: 'CREDIT',
            amount: amountToCredit,
            reference: `FUND-${payload.reference}`,
            description: `Wallet funding via ${providerUpper}`
          }
        })
        
        // Create ledger entry
        await tx.ledgerEntry.create({
          data: {
            walletTransactionId: walletTx.id,
            amount: amountToCredit,
            balanceAfter: newBalance
          }
        })
        
        // Update cached balance
        await tx.wallet.update({
          where: { id: account.user.wallet!.id },
          data: { cachedBalance: newBalance }
        })
        
        // Referral Completion Logic
        const pendingReferral = await tx.referral.findUnique({
          where: { referredUserId: account.userId }
        })
        
        if (pendingReferral && pendingReferral.status === 'PENDING') {
          // Reward the referrer
          const referrerWallet = await tx.wallet.findUnique({ where: { userId: pendingReferral.referrerId } })
          if (referrerWallet) {
            const reward = Number(pendingReferral.rewardAmount)
            const refNewBalance = Number(referrerWallet.cachedBalance) + reward
            
            await tx.wallet.update({
              where: { id: referrerWallet.id },
              data: { cachedBalance: refNewBalance }
            })
            
            const refTx = await tx.walletTransaction.create({
              data: {
                walletId: referrerWallet.id,
                type: 'CREDIT',
                amount: reward,
                reference: `REF-BONUS-${payload.reference}`,
                description: `Referral bonus for inviting ${account.user.username}`
              }
            })
            
            await tx.ledgerEntry.create({
              data: { walletTransactionId: refTx.id, amount: reward, balanceAfter: refNewBalance }
            })
            
            await tx.referral.update({
              where: { id: pendingReferral.id },
              data: { status: 'COMPLETED' }
            })
            
            // Notify referrer
            await tx.notification.create({
              data: {
                userId: pendingReferral.referrerId,
                type: 'IN_APP',
                title: 'Referral Bonus Earned!',
                message: `You earned NGN ${reward} because your referral ${account.user.username} made their first deposit.`
              }
            })
          }
        }
        
        // Mark webhook as PROCESSED
        await tx.paymentWebhook.update({
          where: { id: webhook.id },
          data: { status: 'PROCESSED' }
        })
        
        // Mock Email Notification Event
        await tx.notification.create({
          data: {
            userId: account.userId,
            type: 'EMAIL',
            title: 'Wallet Funded Successfully',
            message: `Your wallet has been credited with NGN ${amountToCredit}. New Balance: NGN ${newBalance}`
          }
        })
      })
      
      return reply.status(200).send({ status: 'success' })
      
    } catch (error) {
      server.log.error(error, 'Webhook Error')
      return reply.status(500).send({ status: 'error', message: 'Internal Server Error' })
    }
  })
}

export default walletRoutes
