/**
 * Auth Middleware - JWT token verification for protected routes
 *
 * Extracts JWT from HTTP-only cookie, verifies with secret key
 * Attaches userId to req object for downstream controllers
 * Returns 401 if token missing or invalid
 */
import jwt from 'jsonwebtoken';
const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - token not found' });
    }
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodeToken) {
      return res.status(401).json({ message: 'Unauthorized - invalid token' });
    }
    req.userId = decodeToken.userId;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized - token verification failed' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized - token expired' });
    }
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default isAuth;
