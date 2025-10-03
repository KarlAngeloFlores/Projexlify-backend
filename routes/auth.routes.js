const express = require('express');
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const authValidator = require('../validators/auth.validator');
const userValidator = require('../validators/user.validator');

const router = express.Router();

router.post('/login', authValidator.login, authController.login);

router.post('/register', authValidator.register, authController.register);
router.post('/verify', authValidator.registerAndVerify, authController.registerAndVerify);
router.post('/logout', auth, authController.logout);
router.patch('/change_password', auth, authValidator.changePassword, authController.changePassword);
router.post('/forgot_password', authValidator.forgotPassword, authController.forgotPassword);
router.post('/verify_reset_password', authValidator.verifyResetPassword, authController.verifyResetPassword);
router.patch('/confirm_password', authValidator.confirmNewPassword, authController.confirmNewPassword);
router.post('/resend_code', authValidator.resendVerificationCode, authController.resendVerificationCode);

router.get('/me', auth, authController.me);
router.get('/get_member', auth, userValidator.getUser, userController.getUser);
module.exports = router;