import { buildApp } from './app'

const server = buildApp()

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000
    await server.listen({ port, host: '0.0.0.0' })
    server.log.info(`Server listening on http://localhost:${port}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
