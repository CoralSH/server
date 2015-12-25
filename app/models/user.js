
/**
 * Dependencies
 */

import { omit } from 'lodash'
import Promise from 'bluebird'
import { isEmail } from 'validator'
import httpError from 'http-errors'
import timestamp from 'mongoose-timestamp'
import mongoose, { Schema } from 'mongoose'
import enhancedUnique from 'mongoose-unique-validator'

import bcrypt from '../../lib/wrappers/bcrypt'
import { hashPassword } from '../../lib/util/crypto'
import { isPassword } from '../../lib/util/validator'

/**
 * Schema
 */

const User = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
    minLength: 3,
    maxLength: 25,
    validate: {
      validator: v => /^[a-zA-Z0-9_-]*$/.test(v),
      message: 'Username should be >= 3 && <= 25 characters long.'
    }
  },
  hashedPassword: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
    validate: {
      validator: email => isEmail(email),
      message: 'Email address should abide RFC 5322.'
    }
  }
})

/**
 * Plugins
 */

User.plugin(timestamp)
User.plugin(enhancedUnique, {
  message: 'Account with this {PATH} already exists.'
})

/**
 * Statics
 */

User.statics.register = function(obj) {
  const user = new this(omit(obj, 'password'))
  return user.setPassword(obj.password)
}

/**
 * Methods
 */

User.methods.setPassword = async function (pass) {
  if (!isPassword(pass)) throw httpError(400, 'Password should contain >= 1 \
\ digit, lowercase letter, uppercase letter, and >= 8 characters long.')
  this.hashedPassword = await hashPassword(pass)
  return this.saveAsync()
}

User.methods.isValidPassword = function (password) {
  return bcrypt.compareAsync(password, this.password)
}

/**
 * Promisify `User`
 */

const model = mongoose.model('users', User)
Promise.promisifyAll(model)
Promise.promisifyAll(model.prototype)

/**
 * Expose `User` as default
 */

export default model
