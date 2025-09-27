const logService = require("../services/log.service");
const { logSuccess, logError } = require("../utils/logs.util");
const { sendError, sendSuccess, getFriendlyErrorMessage } = require("../utils/util");

const logController = {

    /**
     * not fully required since I already put a log status change upon creating, updating, deleting a project. -> just incase needed.
     * @route POST /create_project_log -> body
     * @protected
     * */
    createProjectChangeLog: async (req, res) => {
        try {

            const userId = req.user.id;
            const { projectId, oldStatus, newStatus, remark } = req.body;
            
            const result = await logService.createProjectChangeLog(projectId, oldStatus, newStatus, remark, userId);
            
            logSuccess(result.message)
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error.message);
            sendError(res, 500, getFriendlyErrorMessage(error));   
        }
    },

    /**
     * not fully required since I already put a log status change upon creating, updating, deleting a task on a project. -> just incase needed.
     * @route POST /create_task_log -> body
     * @protected
     * */
    createTaskChangeLog: async (req, res) => {
        try {
            
            const userId = req.user.id;
            const { taskId, oldStatus, newStatus, remark } = req.body;
            
            const result = await logService.createTaskChangeLog(taskId, oldStatus, newStatus, remark, userId);
            logSuccess(result.message);
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error.message);
            sendError(res, 500, getFriendlyErrorMessage(error));  
        }
    },

    getProjectHistory: async (req, res) => {
        try {
            
            const { projectId } = req.query;
            
            const data = await logService.getProjectHistory(projectId);
            logSuccess(data.message);
            sendSuccess(res, 200, data);

        } catch (error) {
            logError(error.message);
            sendError(res, 500, getFriendlyErrorMessage(error));
        }
    }, 
    getTasksHistoryByProject: async (req, res) => {
        try {

            const { projectId } = req.query;
            const data = await logService.getTasksHistoryByProject(projectId);
            logSuccess(data.message);
            sendSuccess(res, 200, data);
            
        } catch (error) {
            logError(error.message);
            sendError(res, 500, getFriendlyErrorMessage(error));
        }
    }

}

module.exports = logController;