import { randomBytes, createHash } from 'crypto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class ApiKeyService {
  /**
   * Generates a new API key.
   * Returns both the plaintext key (to show to the user once) and the hashed key prefix.
   */
  async generateKey(userId: string, name: string, scopes: string[] = []): Promise<{ plaintextKey: string, keyPrefix: string, name: string }> {
    // Generate secure random key
    const rawBytes = randomBytes(32).toString('hex')
    const plaintextKey = `NF_live_${rawBytes}`
    
    const keyPrefix = plaintextKey.substring(0, 16)
    const keyHash = createHash('sha256').update(plaintextKey).digest('hex')
    
    // Save hashed key
    await prisma.$transaction(async (tx) => {
      const apiKey = await tx.apiKey.create({
        data: {
          userId,
          name,
          keyPrefix,
          keyHash,
        }
      })
      
      if (scopes.length > 0) {
        await tx.apiKeyScope.createMany({
          data: scopes.map(scope => ({
            apiKeyId: apiKey.id,
            scope
          }))
        })
      }
    })
    
    return { plaintextKey, keyPrefix, name }
  }

  /**
   * Verifies an incoming plaintext key against the database.
   */
  async verifyKey(plaintextKey: string): Promise<{ valid: boolean, userId?: string, apiKeyId?: string, scopes?: string[] }> {
    if (!plaintextKey.startsWith('NF_live_')) {
      return { valid: false }
    }

    const keyHash = createHash('sha256').update(plaintextKey).digest('hex')
    
    const apiKey = await prisma.apiKey.findUnique({
      where: { keyHash },
      include: { scopes: true }
    })
    
    if (!apiKey || !apiKey.isActive) {
      return { valid: false }
    }
    
    // Update last used asynchronously
    prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() }
    }).catch(console.error)
    
    return {
      valid: true,
      userId: apiKey.userId,
      apiKeyId: apiKey.id,
      scopes: apiKey.scopes.map(s => s.scope)
    }
  }

  /**
   * Revokes an API Key
   */
  async revokeKey(userId: string, apiKeyId: string): Promise<boolean> {
    const key = await prisma.apiKey.findFirst({
      where: { id: apiKeyId, userId }
    })
    
    if (!key) return false
    
    await prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { isActive: false }
    })
    
    return true
  }
}

export const apiKeyService = new ApiKeyService()
