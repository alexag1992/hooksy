import jwt from 'jsonwebtoken'

export function verifyStaffToken(token: string): boolean {
  const secret = process.env.STAFF_SHARED_SECRET
  if (!secret) return false
  try {
    jwt.verify(token, secret, { issuer: 'staff-portal' })
    return true
  } catch {
    return false
  }
}
