const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Users = require('../../models/users');
const jwtAuth = require('../../middlewares/jwtAuth');

const jwtSecret =  'thisismysecret';

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ code: 'UA', message: 'Email and password are required' });
  }

  Users.loginUser(email, password, (err, user) => {
    if (err) {
      return res.status(500).json({ code: 'ER', message: 'Error logging in' });
    }
    if (!user) {
      return res.status(401).json({ code: 'UA', message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { user: { id: user.id, email: user.email, Firstname: user.Firstname, Lastname: user.Lastname, age: user.age } },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: 'lax',
    });

    return res.json({
      code: 'OK',
      message: 'Login successfully',
      token,
      user,
    });
  });
});

router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token');
  } catch (_) {}
  return res.json({ code: 'OK', message: 'Logout successfully' });
});

router.get('/me', jwtAuth, (req, res) => {
  return res.json({ code: 'OK', message: 'User session', user: req.user });
});

router.post('/register', (req, res) => {
  const { email, password, Firstname, Lastname } = req.body || {};
  const age = req.body?.age;

  if (!email || !password || !Firstname || !Lastname) {
    return res.status(400).json({ code: 'UA', message: 'Missing required fields' });
  }

  const normalizedEmail = String(email).toLowerCase();
  const payload = {
    email: normalizedEmail,
    password,
    Firstname,
    Lastname,
    ...(age !== undefined ? { age: Number(age) } : {}),
  };

  Users.getUserByEmail(normalizedEmail, (checkErr, existing) => {
    if (checkErr) {
      return res.status(500).json({ code: 'ER', message: 'Error checking user' });
    }
    if (existing) {
      return res.status(409).json({ code: 'UA', message: 'User already exists' });
    }

    Users.saveUser(payload, (saveErr, newUser) => {
      if (saveErr) {
        console.error('Register saveUser error:', saveErr);
        return res.status(500).json({ code: 'ER', message: 'Error creating user' });
      }

      const token = jwt.sign(
        { user: { id: newUser.id, email: newUser.email, Firstname: newUser.Firstname, Lastname: newUser.Lastname, age: newUser.age } },
        jwtSecret,
        { expiresIn: '1h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        sameSite: 'lax',
      });

      return res.status(201).json({
        code: 'OK',
        message: 'User registered',
        token,
        user: newUser,
      });
    });
  });
});

module.exports = router;
