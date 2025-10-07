const Users = require('../models/users');

module.exports = (req, res, next) => {
  const apiKey = req.query.apikey || req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ code: 'UA', message: 'API key is required!' });
  }

  Users.getUserByApiKey(apiKey, (err, user) => {
    if (err) return res.status(500).json({ code: 'ER', message: 'Error getting user by API key!' });
    if (!user) return res.status(401).json({ code: 'UA', message: 'API key is invalid!' });
    req.user = user;
    next();
  });
};
