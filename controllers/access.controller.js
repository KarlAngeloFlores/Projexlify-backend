const accessService = require("../services/access.service");
const { logError, logSuccess } = require("../utils/logs.util");
const { sendError, sendSuccess, getFriendlyErrorMessage } = require("../utils/util");

const accessControler = {

    giveAccess: async (req, res) => {
        try {
            
            const { email, projectId, role } = req.body;
            const result = await accessService.giveAccess(email, projectId, role);

            logSuccess(result.message);
            sendSuccess(res, 201, result);

        } catch (error) {
            logError(error.message);
            const statusCode = error.statusCode;
            sendError(res, statusCode, getFriendlyErrorMessage(error));
        }
    },

    updateAccess: async (req, res) => {
        try {
            
            const { userId, projectId, role } = req.body;
            const result = await accessService.updateAccess(userId, projectId, role);
            logSuccess(result.message);
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error.message);
            const statusCode = error.statusCode;
            sendError(res, statusCode, getFriendlyErrorMessage(error));
        }
    },

    removeAccess: async (req, res) => {
        try {
            
            const { userId, projectId } = req.body;
            const result = await accessService.removeAccess(userId, projectId);
            logSuccess(result.message);
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error.message);
            const statusCode = error.statusCode;
            sendError(res, statusCode, getFriendlyErrorMessage(error));
        }
    },
};

module.exports = accessControler;