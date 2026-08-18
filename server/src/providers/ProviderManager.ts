import { PrismaClient } from '@prisma/client'

export interface IProvider {
  name: string
  purchaseAirtime(phone: string, amount: number, reference: string): Promise<{ success: boolean; providerReference?: string; error?: string }>
  purchaseData(phone: string, planCode: string, reference: string): Promise<{ success: boolean; providerReference?: string; error?: string }>
  purchaseElectricity(meterNumber: string, amount: number, reference: string): Promise<{ success: boolean; providerReference?: string; token?: string; error?: string }>
  purchaseDataPin(network: string, amount: number, reference: string): Promise<{ success: boolean; providerReference?: string; pin?: string; error?: string }>
}

// Mock VTU Provider Implementation
export class MockVtuProvider implements IProvider {
  name = 'MOCK_VTU'

  async purchaseAirtime(phone: string, amount: number, reference: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      return { success: false, error: 'Provider timeout' }
    }
    
    return { 
      success: true, 
      providerReference: `MOCK-${Date.now()}-${reference}` 
    }
  }

  async purchaseData(phone: string, planCode: string, reference: string) {
    await new Promise(resolve => setTimeout(resolve, 800))
    return { 
      success: true, 
      providerReference: `MOCK-DATA-${Date.now()}-${reference}` 
    }
  }

  async purchaseElectricity(meterNumber: string, amount: number, reference: string) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { 
      success: true, 
      providerReference: `MOCK-ELEC-${Date.now()}-${reference}`,
      token: `1234-5678-9012-3456-7890` // Fake token
    }
  }

  async purchaseDataPin(network: string, amount: number, reference: string) {
    await new Promise(resolve => setTimeout(resolve, 600))
    return { 
      success: true, 
      providerReference: `MOCK-PIN-${Date.now()}-${reference}`,
      pin: `${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}` // Fake 16-digit pin
    }
  }
}

export class ProviderManager {
  private providers: Map<string, IProvider> = new Map()

  constructor() {
    // Register providers
    const mockProvider = new MockVtuProvider()
    this.providers.set(mockProvider.name, mockProvider)
  }

  getProvider(name: string): IProvider {
    const provider = this.providers.get(name)
    if (!provider) {
      throw new Error(`Provider ${name} not found or not active`)
    }
    return provider
  }
}

export const providerManager = new ProviderManager()
