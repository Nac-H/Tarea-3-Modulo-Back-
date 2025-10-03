const express = require('express');
const cors = require('cors')
const mongoose = require('./db');
const performance= require('./middlewares/performance');
const params = require("./middlewares/Params");
const eventRoutes = require('./controllers/v1/events');
const health  = require('./controllers/v1/health');
const userRoutes = require('./controllers/v1/users');
const authRoutes = require('./controllers/v1/auths');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(performance);
app.use(params);
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
/** Controllers */

app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/health', health);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auths', authRoutes);
const port = 3001;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

