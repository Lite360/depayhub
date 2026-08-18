import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import * as argon2 from 'argon2'
import { PrismaClient } from '@prisma/client'
import { emailService } from '../../services/EmailService'

const prisma = new PrismaClient()

const registerSchema = z.object({
  fullName: z.string().min(2),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
  pin: z.string().length(4), // Secure 4-digit transaction PIN
  referralCode: z.string().optional()
})

const loginSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().optional(),
  password: z.string()
})

const pinLoginSchema = z.object({
  username: z.string(),
  pin: z.string().length(4)
})

const authRoutes: FastifyPluginAsync = async (server) => {
  server.post('/register', async (request, reply) => {
    try {
      const { fullName, username, email, password, pin, referralCode } = registerSchema.parse(request.body)
      
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] }
      })

      if (existingUser) {
        return reply.status(400).send({ error: 'User with email or username already exists' })
      }

      const passwordHash = await argon2.hash(password)
      const pinHash = await argon2.hash(pin)

      const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            fullName,
            username,
            email,
            passwordHash,
            pinHash,
            wallet: {
              create: {
                cachedBalance: 0
              }
            }
          }
        })
        
        // Log security event
        await tx.securityEvent.create({
          data: {
            userId: newUser.id,
            eventType: 'REGISTER',
            ip: request.ip
          }
        })
        
        // Handle referral if provided
        if (referralCode) {
          const referrer = await tx.user.findUnique({ where: { username: referralCode } })
          if (referrer) {
            await tx.referral.create({
              data: {
                referrerId: referrer.id,
                referredUserId: newUser.id,
                status: 'PENDING',
                rewardAmount: 500 // flat reward for MVP
              }
            })
          }
        }
        
        return newUser
      })

      const token = server.jwt.sign({ id: user.id, role: user.role })
      
      return reply.status(201).send({
        status: 'success',
        message: 'User registered successfully',
        token,
        user: { id: user.id, username: user.username, email: user.email }
      })
      
    } catch (error) {
      server.log.error(error)
      return reply.status(400).send({ error: 'Registration failed' })
    }
  })

  server.post('/login', async (request, reply) => {
    try {
      const { email, password } = loginSchema.parse(request.body)
      
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        return reply.status(401).send({ error: 'Invalid credentials' })
      }

      const isValid = await argon2.verify(user.passwordHash, password)
      if (!isValid) {
        // Log failed login and send security alert
        await prisma.securityEvent.create({
          data: { userId: user.id, eventType: 'LOGIN_FAILED', ip: request.ip }
        })
        emailService.sendFailedLoginAlert(user.email, request.ip).catch(() => {})
        return reply.status(401).send({ error: 'Invalid credentials' })
      }

      const token = server.jwt.sign({ id: user.id, role: user.role })

      // Create session
      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          ip: request.ip,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      })
      
      await prisma.securityEvent.create({
        data: {
          userId: user.id,
          eventType: 'LOGIN_SUCCESS',
          ip: request.ip
        }
      })

      // Send login alert email (fire-and-forget)
      const userAgent = request.headers['user-agent'] || 'Unknown'
      emailService.sendLoginAlert({
        userId: user.id,
        email: user.email,
        device: userAgent,
        browser: userAgent,
        ip: request.ip,
        timestamp: new Date().toISOString()
      }).catch(() => {})

      return reply.send({
        status: 'success',
        token,
        user: { id: user.id, username: user.username, email: user.email }
      })

    } catch (error) {
      server.log.error(error)
      return reply.status(401).send({ error: 'Invalid credentials' })
    }
  })

  // Welcome-back PIN login
  server.post('/pin-login', async (request, reply) => {
    try {
      const { username, pin } = pinLoginSchema.parse(request.body)
      
      const user = await prisma.user.findUnique({ where: { username } })
      if (!user || user.status !== 'ACTIVE') {
        return reply.status(401).send({ error: 'Invalid credentials or inactive account' })
      }
      
      const isPinValid = await argon2.verify(user.pinHash, pin)
      if (!isPinValid) {
        return reply.status(401).send({ error: 'Invalid PIN' })
      }
      
      const token = server.jwt.sign({ id: user.id, role: user.role })
      
      return reply.status(200).send({
        status: 'success',
        token,
        user: { id: user.id, username: user.username, email: user.email, role: user.role, fullName: user.fullName }
      })
      
    } catch (error) {
      server.log.error(error)
      return reply.status(401).send({ error: 'Login failed' })
    }
  })

  // Get current user profile
  server.get('/me', {
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    }
  }, async (request, reply) => {
    const jwtUser = request.user as any
    const user = await prisma.user.findUnique({
      where: { id: jwtUser.id },
      select: { id: true, username: true, email: true, role: true, fullName: true }
    })
    
    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }
    
    return { status: 'success', user }
  })
}

export default authRoutes
