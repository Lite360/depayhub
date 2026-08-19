import { buildApp } from '../server/src/app'
import type { IncomingMessage, ServerResponse } from 'http'

// Build the Fastify app once (reused across warm invocations)
const app = buildApp()

// Prime the app so it's ready to handle requests
let isReady = false
const readyPromise = app.ready().then(() => {
  isReady = true
})

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!isReady) {
    await readyPromise
  }
  app.server.emit('request', req, res)
}
