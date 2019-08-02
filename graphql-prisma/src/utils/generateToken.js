import jwt from 'jsonwebtoken'

const PASS_KEY = 'mysecretword'
const expiresIn = '7d'
const generateToken = (userId) => jwt.sign({ userId }, PASS_KEY, { expiresIn })

export { generateToken as default }
