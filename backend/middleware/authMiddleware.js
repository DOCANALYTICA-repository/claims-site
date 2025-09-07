import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import config from '../config.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, config.jwtSecret);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      // --- DETAILED ERROR LOGGING ---
      console.error('--- TOKEN VERIFICATION FAILED ---');
      console.error(error); // Log the entire error object
      // --- END OF LOGGING ---

      res.status(401);
      // We throw the error so the frontend catch block can see it
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

export const hod = (req, res, next) => {
  if (req.user && req.user.role === 'Faculty/Staff' && req.user.designation === 'HOD') {
    next();
  } else {
    res.status(403);
    throw new Error('User is not authorized as an HOD');
  }
};