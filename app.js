require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./config/db');
const app = express();

//to add rate limiter

const allowedOrigins = ['http://localhost:5173', 'http://192.168.1.7:5173'];

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

module.exports = app;