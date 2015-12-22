
/**
 * Module dependencies
 */

import Koa from 'koa'
import logger from 'koa-logger'
import convert from 'koa-convert'
import compose from 'koa-compose'
import bodyParser from 'koa-bodyparser'

import routes from './config/routes'

// new app
const app = new Koa()

/**
 * Middleware
 */

// legacy middleware
app.use(compose([
  bodyParser(),
  logger()
].map(convert)))

// router
app.use(compose(routes))

/**
 * Server
 */

const port = process.env.PORT || 3000
app.listen(port, console.log(`listening on port ${port}`))

// expose `app`
export default app
