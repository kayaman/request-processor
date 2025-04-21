import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import { processRequest } from '../services/requestProcessor'

export default async function (fastify: FastifyInstance): Promise<void> {
  // Process route that handles mirrored requests
  fastify.route({
    method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    url: '/process',
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      request.log.info({
        msg: 'Received mirrored request',
        method: request.method,
        url: request.url,
        headers: {
          'x-original-uri': request.headers['x-original-uri'],
          'x-original-method': request.headers['x-original-method'],
          host: request.headers.host,
        },
      })

      // Process the request asynchronously
      processRequest(request).catch((err) => {
        request.log.error({ err, msg: 'Background processing failed' })
      })

      // Return success response
      return { status: 'received' }
    },
  })
}
