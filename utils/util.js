const jwt = require('jsonwebtoken');

/**
 * @return {String} random six digits
 */

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

/**
 * @param {Object} payload - Data to encode
 * @param {String} expiresIn - Token expiration, e.g, '1h'
 * @returns {String} JWT token
 */

const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn});
};

/**
 * @param {String} token - to verify
 * @returns {Object} decoded payload
 */

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * @param {Response} res 
 * @param {Number} statusCode 
 * @param {String} message 
 * @returns {Object} message
 */

const sendError = (res, statusCode = 500, message) => {
    return res.status(statusCode).json({
        message
    });
}

const sendSuccess = (res, statusCode = 200, result) => {
    return res.status(statusCode).json(result);
}

/**
 * @param {String} msg
 * @param {Number} statusCode
 * @param {boolean} isUserFriendly
 * @returns error
 */

const throwError = (msg, code, isUserFriendly = true) => {
    const error = new Error(msg);
    error.statusCode = code;
    error.isUserFriendly = isUserFriendly;
    throw error;
}

/**
 *@param {error} error
 @returns {String} msg
 */

const getFriendlyErrorMessage = (error) => {
    if (!error) return 'Something went wrong. Please try again later.';

    // If the error is explicitly user-friendly, return its message
    if (error.isUserFriendly) return error.message;

    // Map common status codes to friendly messages
    switch (error.statusCode) {
        case 400:
            return 'Invalid request. Please check your input.';
        case 404:
            return 'Requested resource not found.';
        case 409:
            return 'This action conflicts with existing data.';
        default:
            return 'Something went wrong. Please try again later.';
    }
};


module.exports = {
    generateToken,
    verifyToken,
    sendError,
    sendSuccess,
    generateVerificationCode,
    throwError,
    getFriendlyErrorMessage
}