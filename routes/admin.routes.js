const express = require('express');
const userController = require('../controllers/user.controller');
const projectController = require('../controllers/project.controller');

//middlewares
const auth = require('../middlewares/auth.middleware');
const checkAdmin = require('../middlewares/checkAdmin');

const router = express.Router();

//projects
router.get('/get_all_projects', auth, checkAdmin, projectController.getAllProjects);
//users
router.get('/get_users', auth, checkAdmin, userController.getAllUsers);
router.delete('/delete_user', auth, checkAdmin, userController.deleteUser);
router.patch('/patch_user', auth, checkAdmin, userController.updateUser);

module.exports = router;