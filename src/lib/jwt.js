import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Verifies a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Promise<Object>} The decoded token payload
 */
export async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err);
        return reject(err);
      }
      resolve(decoded);
    });
  });
}

/**
 * Signs a JWT token
 * @param {Object} payload - The payload to sign
 * @param {string|number} expiresIn - Expiration time (e.g., '1h', '7d')
 * @returns {string} The signed JWT token
 */
export function signToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn,
    issuer: 'your-app-name',
    audience: 'your-app-users',
  });
}
