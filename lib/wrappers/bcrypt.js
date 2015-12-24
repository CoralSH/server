
/**
 * Dependencies
 */

import bcrypt from 'bcrypt'
import Promise from 'bluebird'

/**
 * Promisify `bcrypt`
 * Expose as `default`
 */

export default Promise.promisifyAll(bcrypt)
