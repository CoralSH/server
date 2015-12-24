
/**
 * Dependencies
 */

import { User, Token } from '../models'

/**
 * POST a new user
 */

export async function register (ctx, next) {
  try {
    var user = await User.register(ctx.request.body)
  } catch (err) {
    if (err.code === 11000) ctx.throw('Account already exists', 422)
  }
  const token = await Token.generate(user)

  ctx.body = { data: { user, token } }
}

/**
 * POST to login
 */

export async function login (ctx, next) {
  const { username, password } = ctx.request.body

  const user = await User.findOneAsync({ username })
  ctx.assert(user, 422, 'Account does not exist')

  await user.isValidPassword(password)
    ? ctx.body = { data: await Token.generate(user) }
    : ctx.throw('Invalid credentials', 422)
}
