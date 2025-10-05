require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const sequelize = require('./config/db');
const app = express();

//to add rate limiter

const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? ['https://projexlify.netlify.app'] //only production
    : ['http://localhost:5173', 'http://192.168.1.9:5173', 'https://projexlify.netlify.app']; //local and production testing

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

const projectRoutes = require('./routes/project.routes');
app.use('/project', projectRoutes);

const logRoutes = require('./routes/log.routes');
app.use('/log', logRoutes);

const accessRoutes = require('./routes/access.routes');
app.use('/access', accessRoutes);

const adminRoutes = require('./routes/admin.routes');
app.use('/admin', adminRoutes);

module.exports = app;