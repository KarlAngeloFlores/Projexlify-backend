const express = require('express');
const projectController = require('../controllers/project.controller');
const taskController = require('../controllers/task.controller');

const auth = require('../middlewares/auth.middleware');
const checkProjectAccess = require('../middlewares/checkProjectAccess.middleware');

const router = express.Router();

    router.post('/create_project', auth, checkProjectAccess(['owner']), projectController.createProject);
    router.patch('/patch_project', auth, checkProjectAccess(['owner']), projectController.updateProject);
    router.get('/get_all_project', auth, checkProjectAccess(['owner']), projectController.getAllProjectByUser);
    router.get('/get_project', auth, checkProjectAccess(['owner']), projectController.getProjectByProjectId);
    router.delete('/delete_project', auth, checkProjectAccess(['owner']), projectController.deleteProject);
    
    router.post('/create_task', auth, checkProjectAccess(['owner']), taskController.createTask);
    router.get('/get_all_task', auth, checkProjectAccess(['owner']), taskController.getTasksByProject);
    router.get('/get_task', auth, taskController.getTaskByTaskId);
    router.delete('/delete_task', auth, checkProjectAccess(['owner']), taskController.deleteTask);
    router.patch('/patch_task', auth, checkProjectAccess(['owner']), taskController.updateTask);

    router.patch('/update_reorder', auth, taskController.updateTaskStatus);

module.exports = router;
