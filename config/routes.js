
/**
 * Module dependencies
 */

import _ from 'koa-route'

/**
 * Controllers
 */

import * as auth from '../app/controllers/auth'

/**
 * Router
 */

export default [
  // Authentication
  _.post('/auth/register', auth.register),
  _.post('/auth/login', auth.login)
]
