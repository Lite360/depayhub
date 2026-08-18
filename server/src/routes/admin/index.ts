import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const adminRoutes: FastifyPluginAsync = async (server) => {
  // Middleware to ensure user is ADMIN
  server.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify()
      const user = request.user as any
      if (user.role !== 'ADMIN') {
        return reply.status(403).send({ error: 'Forbidden: Admin access required' })
      }
    } catch (err) {
      reply.send(err)
    }
  })

  // Phase 7: Admin Analytics
  server.get('/metrics', async (request, reply) => {
    const totalUsers = await prisma.user.count()
    
    const walletSum = await prisma.wallet.aggregate({
      _sum: { cachedBalance: true }
    })
    
    const transactionSum = await prisma.transaction.aggregate({
      where: { status: 'SUCCESSFUL' },
      _sum: { amount: true }
    })
    
    const activeVendors = await prisma.user.count({
      where: { role: 'VENDOR', status: 'ACTIVE' }
    })
    
    return {
      status: 'success',
      metrics: {
        totalUsers,
        totalWalletBalance: walletSum._sum.cachedBalance || 0,
        totalTransactionVolume: transactionSum._sum.amount || 0,
        activeVendors
      }
    }
  })

  server.get('/users', async (request, reply) => {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true, status: true, createdAt: true }
    })
    return { status: 'success', users }
  })

  server.get('/transactions', async (request, reply) => {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    return { status: 'success', transactions }
  })

  // Phase 4: Vendor Applications
  server.get('/vendor-applications', async (request, reply) => {
    const applications = await prisma.vendorApplication.findMany({
      where: { status: 'PENDING' },
      include: {
        user: { select: { id: true, username: true, fullName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { status: 'success', applications }
  })

  server.post('/vendor-applications/:id/approve', async (request, reply) => {
    const { id } = request.params as { id: string }
    
    try {
      await prisma.$transaction(async (tx) => {
        const app = await tx.vendorApplication.findUnique({ where: { id } })
        if (!app || app.status !== 'PENDING') {
          throw new Error('Application not found or already processed')
        }
        
        // 1. Update Application Status
        await tx.vendorApplication.update({
          where: { id },
          data: { status: 'APPROVED' }
        })
        
        // 2. Upgrade User Role
        await tx.user.update({
          where: { id: app.userId },
          data: { role: 'VENDOR' }
        })
        
        // 3. Send Notification
        await tx.notification.create({
          data: {
            userId: app.userId,
            type: 'IN_APP',
            title: 'Vendor Application Approved!',
            message: 'Congratulations! You are now a Vendor and can enjoy discounted VTU rates.'
          }
        })
      })
      
      return { status: 'success', message: 'Vendor approved successfully' }
    } catch (error: any) {
      return reply.status(400).send({ error: error.message || 'Failed to approve vendor' })
    }
  })

  server.post('/vendor-applications/:id/reject', async (request, reply) => {
    const { id } = request.params as { id: string }
    
    const app = await prisma.vendorApplication.update({
      where: { id },
      data: { status: 'REJECTED' }
    })
    
    await prisma.notification.create({
      data: {
        userId: app.userId,
        type: 'IN_APP',
        title: 'Vendor Application Update',
        message: 'Your vendor application was rejected at this time.'
      }
    })
    
    return { status: 'success', message: 'Vendor application rejected' }
  })

}

export default adminRoutes
