
/**
 * Module dependencies
 */

import _ from 'koa-route'

// Controllers
import * as auth from '../app/controllers/auth'

/**
 * Router
 */

export default [
  _.post('/auth', auth.init)
]
