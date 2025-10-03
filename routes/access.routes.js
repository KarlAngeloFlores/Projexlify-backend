const express = require('express');
const accessController = require('../controllers/access.controller');
const auth = require('../middlewares/auth.middleware');
const accessValidator = require('../validators/access.validator');
const checkProjectAccess = require('../middlewares/checkProjectAccess.middleware');

const router = express.Router();

router.post('/give_access', auth, checkProjectAccess('owner'), accessValidator.giveAccess, accessController.giveAccess);
router.patch('/patch_access', auth, checkProjectAccess('owner'), accessValidator.updateAccess, accessController.updateAccess);
router.delete('/delete_access', auth, checkProjectAccess('owner'), accessValidator.removeAccess, accessController.removeAccess);

module.exports = router;