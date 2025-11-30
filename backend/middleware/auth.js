const jwt = require('jsonwebtoken');
require('dotenv').config();

// This middleware function acts as a gatekeeper for protected API routes.
// It checks for a valid JSON Web Token (JWT) before allowing a request to proceed.
module.exports = function (req, res, next) {
  // 1. Get the token from the 'x-auth-token' header of the incoming request.
  const token = req.header('x-auth-token');

  // 2. If no token is found in the header, deny access immediately.
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. If a token is present, try to verify it.
  try {
    // Decode the token using the secret key from your .env file.
    // This will throw an error if the token is invalid (e.g., expired or tampered with).
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. If verification is successful, attach the entire decoded user payload 
    //    (which contains the user's ID and role) to the request object.
    req.user = decoded.user; 
    
    // 5. Pass control to the next function in the chain (the actual API route handler).
    next();
  } catch (err) {
    // If jwt.verify() throws an error, it means the token is not valid.
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

