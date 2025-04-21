import { FastifyRequest } from 'fastify'
import axios from 'axios'
import config from '../config/appConfig'

interface ProcessedRequest {
  originalUrl: string
  originalMethod: string
  headers: Record<string, string | string[] | undefined>
  body: any
  timestamp: string
}

export async function processRequest(request: FastifyRequest): Promise<void> {
  try {
    const processedRequest: ProcessedRequest = {
      originalUrl: request.url,
      originalMethod: request.method,
      headers: { ...request.headers },
      body: request.body,
      timestamp: new Date().toISOString(),
    }

    delete processedRequest.headers.authorization
    delete processedRequest.headers.cookie

    await axios.post(config.targetEndpoint, processedRequest, {
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'api-request-processor',
      },
    })

    request.log.info({
      msg: 'Request processed and forwarded successfully',
      originalUrl: processedRequest.originalUrl,
      targetEndpoint: config.targetEndpoint,
    })
  } catch (error) {
    request.log.error({
      msg: 'Failed to process or forward request',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
