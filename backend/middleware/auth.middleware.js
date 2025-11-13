import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../model/user.model.js';


// Middleware to protect routes that require a logged-in user
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check for the token in the Authorization header
  if(
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Get token from header (it's in the format "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user by the ID from the token's payload
      // Attach the user object to the request, but exclude the password
      req.user = await User.findById(decoded.id).select('-password');

      // 5. Pass controll to next
      next();
    } catch(error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, no token'});
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token'});
  }
});


// Middleware to protect routes that require an admin user
const admin = (req,res,next) => {
  // This middleware should run AFTER the 'protect' middleware,
  // so we will have access to req.user.
  if(req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin'});
  }
};

export { protect, admin };

