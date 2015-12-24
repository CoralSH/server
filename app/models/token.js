
/**
 * Dependencies
 */

import Promise from 'bluebird'
import jwt from 'jsonwebtoken'
import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'

/**
 * Schema
 */

const Token = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expire: {
    required: true,
    type: Date
  }
})

/**
 * Plugins
 */

Token.plugin(timestamp)

/**
 * Statics
 */

Token.statics.generate = function (user) {
  const token = new this({ user })
  return token.refresh()
}

/**
 * Methods
 */

Token.methods.refresh = async function () {
  const expTime = new Date()
  expTime.setDate(expTime.getDate() + 100)
  this.expire = expTime
  this.token = jwt.sign(this.toObject(), process.env.SECRET)
  return this.saveAsync()
}

/**
 * Promisify `Token`
 */

const model = mongoose.model('tokens', Token)
Promise.promisifyAll(model)
Promise.promisifyAll(model.prototype)

/**
 * Expose `Token` as default
 */

export default model
