import { config } from '../config/index.js';
import { verifyToken } from '../helper/jwt.js';

export const authGuard = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: `UNAUTHORIZED` });
    }
    const token = authHeader.split(' ')[1];
    const validToken = verifyToken(token, config.jwt.accessSecret);
    req.user = validToken;
    next();
  } catch (e) {
    return res.status(403).json({ message: `INVALID TOKEN`, e });
  }
};

export const roleGuard = (...roles) => { 
  return (req, res, next) => {
    const userRoles = req.user.role
    if (!roles.includes(userRoles))  {
      throw new Error('Your roles are not allowed to access this route')
    }
    next()
  }
}