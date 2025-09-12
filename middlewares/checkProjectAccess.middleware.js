const projectModel = require('../models/project.model');
const accessModel = require('../models/access.model');

const { logError, logInfo, logSuccess, logSuccessMiddleware } = require('../utils/logs.util');
const { sendError, getFriendlyErrorMessage } = require('../utils/util');
const db = require('../config/db');

//userId and projectId is required for this middlesware
const checkProjectAccess = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            
            const userId = req.user.id;
            const projectId = req.body?.projectId || req.query?.projectId || req.params?.projectId;
            
            //find project
            const project = await projectModel.findProjectByProjectId(db, projectId);
            if(!project) {
                return sendError(res, 404, 'Project not found');
            };

            const access = await accessModel.findProjectAccess(userId, projectId);
            // logInfo(access);
            if(!access) {
                return sendError(res, 403, 'Access denied. Unauthorized access');
            };
            
            if(allowedRoles.length && !allowedRoles.includes(access.role)) {
                return sendError(res, 403, 'Access denied. Insufficient role');
            };
            
            logSuccessMiddleware('PROJECT ACCESS');
            next();

        } catch (error) {
            logError(error);
            sendError(res, 500, getFriendlyErrorMessage(error));
        }
    }
}

module.exports = checkProjectAccess;