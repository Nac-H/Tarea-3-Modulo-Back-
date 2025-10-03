const router = require('express').Router();
const jwt = require('jsonwebtoken');
const basicAuthMiddleware = require('../../middlewares/basicAuth');
const Users = require('../../models/users');
const jwtSecret = 'thisismysecret';
const apiKeyAuth = require('../../middlewares/apiKey');
const jwtAuth = require('../../middlewares/jwtAuth');


router.get('/me', basicAuthMiddleware, (req, res)=> {
    jwt.sign({ user: req.user }, jwtSecret, { expiresIn: '1h' }, (err, token) => {
        if(err){
            return res.status(500).json({ code: 'ER', message: 'Error generating token!'});
        }
        res.json({ code: 'OK', message: 'Token generated successfully!', data: { token }});
    });
});


router.post('/login', (req, res)=> {
  const { email, password } = req.body;
  if (!email || !password){
    return res.status(400).json({ code: 'UA', message: 'Email and password are required' });
  }
  Users.loginUser(email, password, (err, user) => {
    if (err) return res.status(500).json({ code: 'ER', message: 'Error logging in' });
    if (!user) return res.status(401).json({ code: 'UA', message: 'Invalid credentials' });
    const token = jwt.sign({ user: { id: user.id, email: user.email } }, jwtSecret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000, sameSite: 'lax' });
    return res.json({ code: 'OK', message: 'Login successfully', token, user });
  });

    });
});

router.post('/logout', (req, res)=> {
    req.session.destroy();
    res.json({ code: 'OK', message: 'Logout successfully!'});
});

router.post('/register', async (req, res) => {
  const { email, password, Firstname, Lastname, age } = req.body;

  if (!email || !password || !Firstname || !Lastname) {
    return res.status(400).json({ code: 'UA', message: 'Missing required fields' });
  }

  // Verificar si ya existe usuario
  Users.getUserByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ code: 'ER', message: 'Error checking user' });
    if (user) return res.status(409).json({ code: 'UA', message: 'User already exists' });

    // Guardar nuevo usuario
    Users.saveUser({ email, password, Firstname, Lastname, age }, (err, newUser) => {
      if (err) return res.status(500).json({ code: 'ER', message: 'Error creating user' });

      // Generar JWT
      const token = jwt.sign({ user: newUser }, jwtSecret, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });

      res.status(201).json({ code: 'OK', message: 'User registered', token, user: newUser });
    });
  });
});




module.exports = router;