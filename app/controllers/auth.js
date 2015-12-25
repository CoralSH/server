
/**
 * Dependencies
 */

import mongoose from 'mongoose'
import httpError from 'http-errors'

import { User, Token } from '../models'
import { firstValue } from '../../lib/util/object'

/**
 * POST a new user
 */
export async function register (ctx, next) {
  try {
    var user = await User.register(ctx.request.body)
  } catch (err) {
    throw err instanceof mongoose.Error.ValidationError
      ? httpError(400, firstValue(err.errors).message)
      : err
  }

  Object.assign(ctx, { status: 201, body: {} })
}

/**
 * POST to login
 */
export async function login (ctx, next) {
  const { username, password } = ctx.request.body

  const user = await User.findOneAsync({ username })
  ctx.assert(user, 404, 'Account does not exist')

  await user.isValidPassword(password)
    ? ctx.body = { data: await Token.generate(user) }
    : ctx.throw('Invalid credentials', 401)
}
