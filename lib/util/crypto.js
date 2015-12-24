
import bcrypt from '../wrappers/bcrypt'

export async function hashPassword (password) {
  return bcrypt.hashAsync(password, await bcrypt.genSaltAsync(10))
}
