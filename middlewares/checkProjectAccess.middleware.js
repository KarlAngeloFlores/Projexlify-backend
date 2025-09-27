const ProjectAccess = require('../models/access.model');
const Project = require('../models/project.model');
const { logError, logSuccessMiddleware } = require('../utils/logs.util');
const { sendError, getFriendlyErrorMessage } = require('../utils/util');

//userId and projectId is required for this middlesware, if admin bypass
const checkProjectAccess = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            
            const userId = req.user.id;
            const userRole = req.user.role; //user or super admin
            const projectId = req.body?.projectId || req.query?.projectId || req.params?.projectId;
            
            if(userRole === 'admin') {
                logSuccessMiddleware('PROJECT ACCESS - ADMIN BYPASS');
                return next();
            }

            //find project
            const project = await Project.findOne({ where: { id: projectId } });
            if(!project) {
                return sendError(res, 404, 'Project not found');
            };

            const access = await ProjectAccess.findOne({ 
                where: {
                    user_id: userId,
                    project_id: projectId
                }
             });
            
            if(!access) {
                return sendError(res, 403, 'Access denied. Unauthorized access');
            };
            
            if(allowedRoles.length && !allowedRoles.includes(access.role)) {
                return sendError(res, 403, 'Access denied. Insufficient role');
            };
            
            logSuccessMiddleware('PROJECT ACCESS');
            next();

        } catch (error) {
            logError(error.message);
            sendError(res, 500, getFriendlyErrorMessage(error));
        }
    }
}

module.exports = checkProjectAccess;