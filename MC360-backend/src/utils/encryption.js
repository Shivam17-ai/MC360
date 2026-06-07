import crypto from 'crypto'

const ALGORITHM  = 'aes-256-gcm'
const SECRET_KEY = Buffer.from(process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'), 'hex')
const IV_LENGTH  = 16
const TAG_LENGTH = 16

/**
 * Encrypt sensitive data (e.g. medical records, Aadhar)
 * @param {string} text - plain text to encrypt
 * @returns {string} encrypted string (iv:tag:encrypted)
 */
export const encrypt = (text) => {
  const iv     = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv)

  let encrypted = cipher.update(String(text), 'utf8', 'hex')
  encrypted    += cipher.final('hex')

  const tag = cipher.getAuthTag()

  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`
}

/**
 * Decrypt encrypted data
 * @param {string} encryptedText - (iv:tag:encrypted)
 * @returns {string} decrypted plain text
 */
export const decrypt = (encryptedText) => {
  const [ivHex, tagHex, encrypted] = encryptedText.split(':')

  const iv       = Buffer.from(ivHex, 'hex')
  const tag      = Buffer.from(tagHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv)

  decipher.setAuthTag(tag)

  let decrypted  = decipher.update(encrypted, 'hex', 'utf8')
  decrypted     += decipher.final('utf8')

  return decrypted
}

/**
 * Hash a password or sensitive value (one-way, not reversible)
 * Use bcrypt in auth — this is for non-password data
 * @param {string} value
 */
export const hashValue = (value) => {
  return crypto
    .createHmac('sha256', process.env.ENCRYPTION_KEY || 'default_key')
    .update(String(value))
    .digest('hex')
}

/**
 * Compare a plain value to a hashed one
 */
export const compareHash = (value, hash) => {
  return hashValue(value) === hash
}