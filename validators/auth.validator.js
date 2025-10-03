const { sendError } = require('../utils/util');
const { isValidEmail } = require('../utils/validator.util');

//regex for username (only letters, no numbers, no special chars, no spaces)
const usernameRegex = /^[A-Za-z]+$/;

const authValidator = {
    login: (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !isValidEmail(email)) {
            return sendError(res, 400, "Valid email is required");
        }

        if (!password || password.length < 6) {
            return sendError(res, 400, "Password must be at least 6 characters long");
        }

        next();
    },

    register: (req, res, next) => {
        const { email, username } = req.body;

        if (!email || !isValidEmail(email)) {
            return sendError(res, 400, "Valid email is required");
        }

        if (!username || username.length < 3) {
            return sendError(res, 400, "Username must be at least 3 characters long");
        }

        if (!usernameRegex.test(username)) {
            return sendError(res, 400, "Username must only contain letters (no numbers, spaces, or special characters)");
        }

        next();
    },

registerAndVerify: (req, res, next) => {
    const { token, password, code } = req.body;

    if (!token) {
        return sendError(res, 400, "Token is missing or invalid. Please register again.");
    }

    if (!password || password.length < 6) {
        return sendError(res, 400, "Password must be at least 6 characters long");
    }

    if (!code) {
        return sendError(res, 400, "Verification code is required");
    }

    next();
},


    forgotPassword: (req, res, next) => {
        const { email } = req.body;

        if (!email || !isValidEmail(email)) {
            return sendError(res, 400, "Valid email is required");
        }

        next();
    },

    verifyResetPassword: (req, res, next) => {
        const { email, code } = req.body;

        if (!email || !isValidEmail(email)) {
            return sendError(res, 400, "Valid email is required");
        }

        if (!code) {
            return sendError(res, 400, "Reset code is required");
        }

        next();
    },

    confirmNewPassword: (req, res, next) => {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !isValidEmail(email)) {
            return sendError(res, 400, "Valid email is required");
        }

        if (!newPassword || newPassword.length < 6) {
            return sendError(res, 400, "New password must be at least 6 characters long");
        }

        if (newPassword !== confirmPassword) {
            return sendError(res, 400, "Passwords do not match");
        }

        next();
    },

    resendVerificationCode: (req, res, next) => {
        const { email, purpose } = req.body;

        if (!email || !isValidEmail(email)) {
            return sendError(res, 400, "Valid email is required");
        }

        if (!purpose) {
            return sendError(res, 400, "Purpose is required");
        }

        next();
    },

    changePassword: (req, res, next) => {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword) {
            return sendError(res, 400, "Old password is required");
        }

        if (!newPassword || newPassword.length < 6) {
            return sendError(res, 400, "New password must be at least 6 characters long");
        }

        next();
    }
};

module.exports = authValidator;
