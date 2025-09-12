const express = require('express');
const auth = require('../middlewares/auth.middleware');
const checkProjectAccess = require('../middlewares/checkProjectAccess.middleware')
const taskController = require('../controllers/task.controller');

const router = express.Router();

    // router.post('/create_task', auth, checkProjectAccess, taskController.createTask);
    // router.get('/get_project_task/:projectId', auth, taskController.getTaskByProject);

module.exports = router;    