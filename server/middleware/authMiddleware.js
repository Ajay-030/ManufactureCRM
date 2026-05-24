import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mockStore from '../config/mockStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_fallback_key');

      // Mock database fallback
      if (global.useMockDb) {
        const mockUser = mockStore.users.find(u => u._id === decoded.id);
        if (!mockUser) {
          return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
        const { password, ...userWithoutPassword } = mockUser;
        req.user = userWithoutPassword;
        return next();
      }

      // Get user from token and exclude password
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};
