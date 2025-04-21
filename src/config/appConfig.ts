import dotenv from 'dotenv'
dotenv.config()

export default {
  port: process.env.PORT || 4000,

  targetEndpoint:
    process.env.TARGET_ENDPOINT || 'http://opin-mop-opin-mop-gateway-service:3000/process',

  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
}
