
/**
 * Dependencies
 */

import Promise from 'bluebird'
import { isEmail } from 'validator'
import timestamp from 'mongoose-timestamp'
import mongoose, { Schema } from 'mongoose'

import bcrypt from '../../lib/wrappers/bcrypt'
import { hashPassword } from '../../lib/util/crypto'

/**
 * Schema
 */

const User = new Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      'Password should contain at least one digit, lowercase letter, uppercase \
letter, and 8 characters overall.'
    ],
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: {
      validator: email => isEmail(email)
    },
    required: true,
    unique: true
  }
})

/**
 * Plugins
 */

User.plugin(timestamp)

/**
 * Statics
 */

User.statics.register = function(obj) {
  const user = new this(obj)
  return user.hashPassword()
}

/**
 * Methods
 */

User.methods.hashPassword = async function () {
  this.password = await hashPassword(this.password)
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
