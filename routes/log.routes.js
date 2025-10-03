const express = require('express');
const logController = require('../controllers/log.controller');
const auth = require('../middlewares/auth.middleware');
const checkProjectAccess = require('../middlewares/checkProjectAccess.middleware');
const logValidator = require('../validators/log.validator');

const router = express.Router();

/**
 * These endpoints exist only to satisfy requirements.
 * Logs are already handled automatically inside project/task actions,
 * so these routes are not needed for the core app functionality.
 * 
 * @protected
 * router.post('/create_project_log', auth, logValidator.createProjectChangeLog, logController.createProjectChangeLog);
 * router.post('/create_task_log', auth, logValidator.createTaskChangeLog, logController.createTaskChangeLog);
 */

router.get('/get_projects_log', auth, checkProjectAccess(['owner']), logValidator.getProjectHistory, logController.getProjectHistory);
router.get('/get_tasks_log', auth, checkProjectAccess(['owner']), logValidator.getTasksHistoryByProject, logController.getTasksHistoryByProject);

module.exports = router;