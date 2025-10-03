const express = require('express');
const userController = require('../controllers/user.controller');
const projectController = require('../controllers/project.controller');
const projectValidator = require('../validators/project.validator');
const userValidator = require('../validators/user.validator');

//middlewares
const auth = require('../middlewares/auth.middleware');
const checkAdmin = require('../middlewares/checkAdmin');

const router = express.Router();

//projects
router.get('/get_all_projects', auth, checkAdmin, projectController.getAllProjects);
router.delete('/delete_project', auth, checkAdmin, projectValidator.hardDeleteProject, projectController.hardDeleteProject);
router.patch('/restore_project', auth, checkAdmin, projectValidator.restoreProject, projectController.restoreProject);

//users
router.get('/get_users', auth, checkAdmin, userController.getAllUsers);
router.delete('/delete_user', auth, checkAdmin, userValidator.deleteUser, userController.deleteUser);
router.patch('/patch_user', auth, checkAdmin, userValidator.updateUser, userController.updateUser);

module.exports = router;