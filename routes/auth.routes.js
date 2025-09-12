const express = require('express');
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', authController.login);
router.get('/me', auth, authController.me);
router.get('/get_member', auth, authController.getUser);

router.post('/register', authController.register);
router.post('/verify', authController.registerAndVerify);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);
router.post('/forgot_password', authController.forgotPassword);
router.post('/verify_reset_password', authController.verifyResetPassword);
router.patch('/confirm_password', authController.confirmNewPassword);
router.post('/resend_code', authController.resendVerificationCode);

module.exports = router;