const express = require('express');
const userController = require('../controllers/user.controller');
const projectController = require('../controllers/project.controller');

//middlewares
const auth = require('../middlewares/auth.middleware');
const checkAdmin = require('../middlewares/checkAdmin');

const router = express.Router();

//users
router.get('/users', auth, checkAdmin, userController.getAllUsers);
router.delete('/user', auth, checkAdmin, userController.deleteUser);
router.patch('/user', auth, checkAdmin, userController.updateUser);
//projects
router.get('/projects', auth, checkAdmin, projectController.getAllProjects);



module.exports = router;