import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface LoginAlertData {
  userId: string
  email: string
  device: string
  browser: string
  ip: string
  timestamp: string
}

interface TransactionEmailData {
  userId: string
  email: string
  reference: string
  service: string
  amount: number
  status: string
  date: string
}

export class EmailService {
  
  /**
   * Send a login security alert email.
   * In production this would call Resend / a transactional email provider.
   * For MVP, we log the event and store a Notification.
   */
  async sendLoginAlert(data: LoginAlertData): Promise<void> {
    console.log(`[EMAIL] Login Alert → ${data.email}`)
    console.log(`  Device: ${data.device}`)
    console.log(`  Browser: ${data.browser}`)
    console.log(`  IP: ${data.ip}`)
    console.log(`  Time: ${data.timestamp}`)
    
    // Store notification for audit trail
    await prisma.notification.create({
      data: {
        userId: data.userId,
        type: 'EMAIL',
        title: 'New Login Detected',
        message: `A new login was detected on ${data.device} (${data.browser}) from IP ${data.ip} at ${data.timestamp}.`
      }
    })
  }

  /**
   * Send a failed login security alert email.
   */
  async sendFailedLoginAlert(email: string, ip: string): Promise<void> {
    console.log(`[EMAIL] Failed Login Alert → ${email} from IP ${ip}`)
    // In production: actually send the email via Resend
  }
  
  /**
   * Send a transaction receipt email.
   */
  async sendTransactionEmail(data: TransactionEmailData): Promise<void> {
    console.log(`[EMAIL] Transaction Receipt → ${data.email}`)
    console.log(`  Reference: ${data.reference}`)
    console.log(`  Service: ${data.service}`)
    console.log(`  Amount: NGN ${data.amount}`)
    console.log(`  Status: ${data.status}`)
    
    await prisma.notification.create({
      data: {
        userId: data.userId,
        type: 'EMAIL',
        title: `Transaction ${data.status}`,
        message: `Your ${data.service} transaction (Ref: ${data.reference}) for NGN ${data.amount} was ${data.status} on ${data.date}.`
      }
    })
  }

  /**
   * Send a wallet funding confirmation email.
   */
  async sendFundingEmail(userId: string, email: string, amount: number, newBalance: number): Promise<void> {
    console.log(`[EMAIL] Funding Confirmation → ${email}`)
    console.log(`  Credited: NGN ${amount}`)
    console.log(`  New Balance: NGN ${newBalance}`)
    
    await prisma.notification.create({
      data: {
        userId,
        type: 'EMAIL',
        title: 'Wallet Funded Successfully',
        message: `Your wallet has been credited with NGN ${amount}. New balance: NGN ${newBalance}.`
      }
    })
  }
}

export const emailService = new EmailService()
