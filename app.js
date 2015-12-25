
/**
 * Module dependencies
 */

import Koa from 'koa'
import Promise from 'bluebird'
import logger from 'koa-logger'
import convert from 'koa-convert'
import compose from 'koa-compose'
import bodyParser from 'koa-bodyparser'

import './config/database'
import routes from './config/routes'
import errorHandler from './app/middleware/error'

// loud rejection
Promise.onPossiblyUnhandledRejection(console.error)

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

app.use(errorHandler)

// router
app.use(compose(routes))

/**
 * Server
 */

const port = process.env.PORT || 3000
app.listen(port, console.log(`listening on port ${port}`))

/**
 * Expose `app`
 */

export default app
