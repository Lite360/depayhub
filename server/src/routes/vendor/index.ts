import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const vendorRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  // Submit vendor application
  server.post('/apply', async (request, reply) => {
    const user = request.user as any
    
    // Check if user is already a vendor
    if (user.role === 'VENDOR') {
      return reply.status(400).send({ error: 'You are already a vendor' })
    }
    
    // Check if there is an existing pending application
    const existingApp = await prisma.vendorApplication.findUnique({
      where: { userId: user.id }
    })
    
    if (existingApp && existingApp.status === 'PENDING') {
      return reply.status(400).send({ error: 'You already have a pending application' })
    }
    
    // Create or update application
    let application;
    if (existingApp) {
      application = await prisma.vendorApplication.update({
        where: { userId: user.id },
        data: { status: 'PENDING' }
      })
    } else {
      application = await prisma.vendorApplication.create({
        data: {
          userId: user.id,
          status: 'PENDING'
        }
      })
    }
    
    return { status: 'success', message: 'Vendor application submitted successfully', application }
  })

  // Get application status
  server.get('/status', async (request, reply) => {
    const user = request.user as any
    
    const application = await prisma.vendorApplication.findUnique({
      where: { userId: user.id }
    })
    
    return { 
      status: 'success', 
      applicationStatus: application ? application.status : 'NOT_APPLIED' 
    }
  })
}

export default vendorRoutes
