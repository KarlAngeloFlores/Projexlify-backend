const express = require('express');
const projectController = require('../controllers/project.controller');
const taskController = require('../controllers/task.controller');

const auth = require('../middlewares/auth.middleware');
const checkProjectAccess = require('../middlewares/checkProjectAccess.middleware');

const taskValidator = require("../validators/task.validator");
const projectValidator = require("../validators/project.validator");

const router = express.Router();

    router.get('/get_all_project', auth, projectController.getAllProjectByUser);
    router.get('/get_project', auth, checkProjectAccess(['owner']), projectValidator.getProjectByProjectId, projectController.getProjectByProjectId);   
    router.post('/create_project',  auth, projectValidator.createProject, projectController.createProject); 
    router.patch('/patch_project', auth, checkProjectAccess(['owner']), projectValidator.updateProject, projectController.updateProject);
    router.delete('/delete_project', auth, checkProjectAccess(['owner']), projectValidator.deleteProject, projectController.deleteProject);
     
    router.post('/create_task', auth, checkProjectAccess(['owner']), taskValidator.createTask, taskController.createTask);
    router.get('/get_all_task', auth, checkProjectAccess(['owner']), taskValidator.getTasksByProject, taskController.getTasksByProject);
    router.get('/get_task', auth, checkProjectAccess(['owner']), taskValidator.getTaskByTaskId, taskController.getTaskByTaskId);
    router.delete('/delete_task', auth, checkProjectAccess(['owner']), taskValidator.deleteTask, taskController.deleteTask);
    router.patch('/patch_task', auth, checkProjectAccess(['owner']), taskValidator.updateTask, taskController.updateTask);

    router.patch('/update_reorder', auth, checkProjectAccess(['owner']), taskValidator.updateTaskStatus, taskController.updateTaskStatus);

module.exports = router;
