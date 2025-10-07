const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'thisismysecret';

module.exports = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const bearerToken = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const cookieToken = req.cookies && req.cookies.token;
  const token = bearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ code: 'UA', message: 'Token is required' });
  }

  jwt.verify(token, jwtSecret, (err, payload) => {
    if (err) {
      return res.status(401).json({ code: 'UA', message: 'Invalid or expired token' });
    }
    req.user = payload.user || payload;
    next();
  });
};
