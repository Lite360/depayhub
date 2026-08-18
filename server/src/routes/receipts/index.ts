import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { receiptService } from '../../services/ReceiptService'

const prisma = new PrismaClient()

const receiptRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  // View receipt details
  server.get('/:reference', async (request, reply) => {
    const user = request.user as any
    const { reference } = request.params as { reference: string }
    
    const receipt = await prisma.receipt.findUnique({
      where: { reference },
      include: { items: true }
    })
    
    if (!receipt || receipt.userId !== user.id) {
      return reply.status(404).send({ error: 'Receipt not found' })
    }
    
    return { status: 'success', receipt }
  })

  // Download normal receipt as PDF
  server.get('/:reference/download', async (request, reply) => {
    const user = request.user as any
    const { reference } = request.params as { reference: string }
    
    const receipt = await prisma.receipt.findUnique({
      where: { reference },
      include: { items: true }
    })
    
    if (!receipt || receipt.userId !== user.id) {
      return reply.status(404).send({ error: 'Receipt not found' })
    }
    
    const pdfBuffer = await receiptService.generateNormalReceipt({
      reference: receipt.reference,
      service: receipt.service,
      product: receipt.items[0]?.name || receipt.service,
      recipient: 'N/A', // Would come from transaction details
      amount: Number(receipt.totalAmount),
      fee: Number(receipt.fee),
      total: Number(receipt.totalAmount) + Number(receipt.fee),
      date: receipt.createdAt.toISOString(),
      status: receipt.status,
      userName: user.id
    })
    
    reply.header('Content-Type', 'application/pdf')
    reply.header('Content-Disposition', `attachment; filename="depayhub-receipt-${reference}.pdf"`)
    return reply.send(pdfBuffer)
  })

  // Download share receipt as PDF (no price info)
  server.get('/:reference/share', async (request, reply) => {
    const user = request.user as any
    const { reference } = request.params as { reference: string }
    
    const receipt = await prisma.receipt.findUnique({
      where: { reference },
      include: { items: true }
    })
    
    if (!receipt || receipt.userId !== user.id) {
      return reply.status(404).send({ error: 'Receipt not found' })
    }
    
    const pdfBuffer = await receiptService.generateShareReceipt({
      reference: receipt.reference,
      service: receipt.service,
      product: receipt.items[0]?.name || receipt.service,
      recipient: 'N/A',
      amount: Number(receipt.totalAmount),
      fee: Number(receipt.fee),
      total: Number(receipt.totalAmount) + Number(receipt.fee),
      date: receipt.createdAt.toISOString(),
      status: receipt.status,
      userName: user.id
    })
    
    reply.header('Content-Type', 'application/pdf')
    reply.header('Content-Disposition', `attachment; filename="depayhub-share-${reference}.pdf"`)
    return reply.send(pdfBuffer)
  })
}

export default receiptRoutes
