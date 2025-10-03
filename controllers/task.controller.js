const taskService = require('../services/task.service');
const { logError, logSuccess } = require('../utils/logs.util');
const { sendError, sendSuccess, getFriendlyErrorMessage } = require('../utils/util');


const taskController = {
createTask: async (req, res) => {
    try {
        const userId = req.user.id;
        const { projectId, name, status, contents } = req.body;
        
        const result = await taskService.createTask(userId, projectId, name, status, contents);
        logSuccess(result.message);   
        sendSuccess(res, 201, result);

    } catch (error) {
        logError(error.message); // Log the technical details for debugging
        const statusCode = error.statusCode || 500;        
        sendError(res, statusCode, getFriendlyErrorMessage(error));
    }
},
        getTasksByProject: async (req, res) => {
            try {

                const { projectId } = req.query;
                const result = await taskService.getTasksByProject(projectId);
                logSuccess(result.message);
                sendSuccess(res, 200, result);

            } catch (error) {
                logError(error.message);
                const statusCode = error.statusCode || 500;
                sendError(res, statusCode, getFriendlyErrorMessage(error));
            }
        },


    getTaskByTaskId: async (req, res) => {
        
        try {
            
            const { taskId } = req.query;

            const result = await taskService.getTaskByTaskId(taskId);
            logSuccess(result.message);
            sendSuccess(res, 200, result);

        } catch (error) {
            const statusCode = error.statusCode || 500;
            logError(error.message)
            sendError(res, statusCode, 'Something went wrong. Try again later');
        }

    },

    updateTask: async (req, res) => {
        try {
            
            const userId = req.user.id;
            const { projectId, taskId, name, contents, newStatus, remark } = req.body;

            const result = await taskService.updateTask(projectId, taskId, name, contents, newStatus, userId, remark);
            logSuccess(result.message);
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error.message);
            const statusCode = error.statusCode || 500;
            sendError(res, statusCode,getFriendlyErrorMessage(error));
        }
    },


    deleteTask: async (req, res) => {
        try {

            const userId = req.user.id;
            const { taskId, projectId, remark } = req.body;

            const result = await taskService.deleteTask(userId, taskId, projectId, remark);
            logSuccess(result.message);
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error.message);
            const statusCode = error.statusCode || 500;
            sendError(res, statusCode, getFriendlyErrorMessage(error));
        }
    },

    updateTaskStatus: async (req, res) => {
        try {

            const userId = req.user.id;
            const { tasks, taskId, newStatus, projectId } = req.body;

            const result = await taskService.updateTaskStatus(tasks, taskId, newStatus, userId, projectId);
            logSuccess(result.message);
            sendSuccess(res, 200, result);
            
        } catch (error) {
            logError(error); 
            const statusCode = error.statusCode || 500;
            sendError(res, statusCode, getFriendlyErrorMessage(error));
        }
    }

}

module.exports = taskController;