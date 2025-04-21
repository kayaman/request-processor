import Fastify from 'fastify'
import config from './config/appConfig'
import processRoutes from './routes/process'

const fastify = Fastify({
  logger: {
    level: config.logger.level,
  },
})

fastify.get('/health', async () => {
  return { status: 'ok' }
})

fastify.register(processRoutes)

const start = async () => {
  try {
    await fastify.listen({
      port: (config.port as number) || 4000,
      host: '0.0.0.0',
    })
    console.log(`Server is running on port ${config.port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
