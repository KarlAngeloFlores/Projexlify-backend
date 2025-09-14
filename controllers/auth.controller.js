const { sendError, sendSuccess, getFriendlyErrorMessage } = require('../utils/util');
const { logInfo, logSuccess, logError } = require('../utils/logs.util');
const { accessTokenCookie, refreshTokenCookie } = require('../utils/cookies.util');
const authService = require('../services/auth.service');

const authController = {
    login: async (req, res) => {
        try {
            
            const { email, password } = req.body;
            const {accessToken} = await authService.login(email, password);

            res.cookie('accessToken', accessToken, accessTokenCookie());
            logSuccess('Logged in successfully');
            sendSuccess(res, 200, 'Logged in successfully');
            
        } catch (error) {
            logError(error.message);
            const status = error.statusCode || 500;
            sendError(res, status, getFriendlyErrorMessage(error));
        }
    },

    getUser: async (req, res) => {
        try {
            
            const userId = req.user.id;
            
            const result = await authService.getUser(userId);
            logSuccess(result.message);
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error.message);
            const status = error.statusCode || 500;
            sendError(res, status, getFriendlyErrorMessage(error));
        }
    },

    me: async (req, res) => {
        try {

            const data = req.user;
            sendSuccess(res, 200, data);
            
        } catch (error) {
            logError(error)
            sendError(res, 500, getFriendlyErrorMessage(error));
        }
    },

    register: async (req, res) => {
        try {
            
            const { email, username } = req.body;
            const result = await authService.register(email, username);
            logSuccess('Sent verification code');
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error);
            const statusCode = error.statusCode || 500;
            sendError(res, statusCode, getFriendlyErrorMessage(error));
        }
    }, 

    registerAndVerify: async (req, res) => {
        try {

            const { token, password, code } = req.body;
            const result = await authService.registerAndVerify(token, password, code);
            logSuccess('Registered Successfully');
            sendSuccess(res, 201, result);
   
        } catch (error) {
            logError(error.message);
            const statusCode = error.statusCode || 500;
            sendError(res, statusCode, getFriendlyErrorMessage(error));
        }
    },

    logout: async (req, res) => { 
        try {

            res.cookie('accessToken', '', accessTokenCookie());
            logSuccess('Logged out successfully');
            sendSuccess(res, 200, { message: 'Logged out successfully' });

        } catch (error) {
            logError(error.message);
            sendError(res, 500, 'Something went wrong. Try again later');
        }
    },

    forgotPassword: async (req, res) => {
        try {
            
            const { email } = req.body;
            
            const result = await authService.forgotPassword(email);
            logSuccess(result.message);
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error.message);
            const statusCode = error.statusCode || 500;
            sendError(res, statusCode, getFriendlyErrorMessage(error));
        }
    },

    verifyResetPassword: async (req, res) => {
        try {
            
            const { email, code } = req.body;

            
            logInfo(email, code)
            const result = await authService.verifyResetPassword(email, code);
            logSuccess(result.message);
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error);
            const statusCode = error.statusCode || 500;
            sendError(res, statusCode, getFriendlyErrorMessage(error));
        }
    },

    confirmNewPassword: async (req, res) => {
        try {
            
            const { email, newPassword, confirmPassword } = req.body;
            
            const result = await authService.confirmNewPassword(email, newPassword, confirmPassword);
            logSuccess(result.message);
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error.message);
            const statusCode = error.statusCode || 500;
            sendError(res, statusCode, getFriendlyErrorMessage(error));
        }
    },

    resendVerificationCode: async (req, res) => {
        try {
            
            const { email, purpose } = req.body;
            
            const result = await authService.resendVerificationCode(email, purpose);
            logSuccess(result.message);
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error)
            sendError(res, 500, getFriendlyErrorMessage(error));
        }
    },

    changePassword: async (req, res) => {
        try {
            const userId = req.user.id;
            const { oldPassword, newPassword } = req.body;
            
            const result = await authService.changePassword(userId, oldPassword, newPassword);
            logSuccess(result.message);
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error);
            const statusCode = error.statusCode || 500;
            sendError(res, statusCode, getFriendlyErrorMessage(error));

        }
    }
}

module.exports = authController;