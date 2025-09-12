const express = require('express');
const projectController = require('../controllers/project.controller');
const taskController = require('../controllers/task.controller');

const auth = require('../middlewares/auth.middleware');
const checkProjectAccess = require('../middlewares/checkProjectAccess.middleware');

const router = express.Router();

    router.post('/create_project', auth, projectController.createProject);
    router.patch('/patch_project', auth, projectController.updateProject);
    router.get('/get_all_project', auth, projectController.getAllProjectByUser);
    router.get('/get_project', auth, checkProjectAccess(['owner', 'write', 'read']), projectController.getProjectByProjectId);
    router.delete('/delete_project', auth, checkProjectAccess(['owner']), projectController.deleteProject);
    
    router.post('/create_task', auth, checkProjectAccess(['owner', 'write']), taskController.createTask);
    router.get('/get_all_task', auth, checkProjectAccess(['owner', 'write', 'read']), taskController.getTasksByProject);
    router.get('/get_task', auth, taskController.getTaskByTaskId);
    router.delete('/delete_task', auth, checkProjectAccess(['owner', 'write']), taskController.deleteTask);
    router.patch('/patch_task', auth, checkProjectAccess(['owner', 'write']), taskController.updateTask);

    router.patch('/update_reorder', auth, taskController.updateTaskStatus);

module.exports = router;
