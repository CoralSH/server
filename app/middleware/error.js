
/**
 * Error handler
 * - catches fallthrough errors
 * - used as upstream middleware
 * - wraps and spits back well-formed JSON
 */

export default async function (ctx, next) {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = { message: err.message }
  }
}
