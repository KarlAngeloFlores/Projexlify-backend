const { logError, logSuccessMiddleware } = require("../utils/logs.util");
const { sendError, getFriendlyErrorMessage } = require("../utils/util");

const checkAdmin = (req, res, next) => {
    
    try {
        const userRole = req.user?.role;
    
    if(userRole !== 'admin') {
        return sendError(res, 403, 'Access denied. Unauthorized access (not admin)');
    }

    logSuccessMiddleware('ADMIN ACCESS')
    next();
    
    } catch (error) {
        logError(error.message);
        sendError(res, 500, getFriendlyErrorMessage(error));
    }
    
}

module.exports = checkAdmin;