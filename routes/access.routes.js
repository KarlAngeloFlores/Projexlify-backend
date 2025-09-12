const express = require('express');
const accessController = require('../controllers/access.controller');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/give_access', auth, accessController.giveAccess);
router.get('/get_shared', auth, accessController.getSharedProjects);
router.patch('/patch_access', auth, accessController.updateAccess);
router.delete('/delete_access', auth, accessController.removeAccess);

module.exports = router;