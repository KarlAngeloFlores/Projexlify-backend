const express = require('express');
const auth = require('../middlewares/auth.middleware');
const checkProjectAccess = require('../middlewares/checkProjectAccess.middleware')
const taskController = require('../controllers/task.controller');

const router = express.Router();

module.exports = router;    