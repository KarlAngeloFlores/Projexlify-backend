const { logInfo, logSuccess, logError } = require('../utils/logs.util');
const { sendError, sendSuccess, getFriendlyErrorMessage } = require('../utils/util');
const projectService = require('../services/project.service');

const projectController = {
    
    createProject: async (req, res) => {
        try {
            
            const { name, description } = req.body;
            const userId = req.user.id;

            const result = await projectService.createProject(name, description, userId);
            logSuccess(result.message);
            sendSuccess(res, 201, result);

        } catch (error) {
            logError(error.message);
            const statusCode = error.statusCode || 500;
            sendError(res, statusCode, getFriendlyErrorMessage(error));
        }
    },

    updateProject: async (req, res) => {
        try {
            
            const { projectId, name, description, newStatus, remark } = req.body;
            const userId = req.user.id;

            const result = await projectService.updateProject(userId, projectId, name, description, newStatus, remark);
            logSuccess(result.message);
            sendSuccess(res, 200, result);
            
        } catch (error) {
            logError(error.message);
            const statusCode = error.statusCode || 500;
            sendError(res, statusCode, getFriendlyErrorMessage(error));
        }
    },

    getProjectByProjectId: async (req, res) => {
        
        try {
            
            const { projectId } = req.query;
            const result = await projectService.getProjectByProjectId(projectId);
            logSuccess(result.message);
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error.message);
            const statusCode = error.statusCode || 500
            sendError(res, statusCode, getFriendlyErrorMessage(error));
        }
    },

    getAllProjectByUser: async (req, res) => {
        try {
            logInfo(req.user)
            const userId = req.user.id;
            const data = await projectService.getProjectsByUser(userId);
            logSuccess(data.message);
            sendSuccess(res, 200, data);

        } catch (error) {
            logError(error.message);
            const statusCode = error.statusCode || 500;
            sendError(res, statusCode, getFriendlyErrorMessage(error));
        }
    },



    deleteProject: async (req, res) => {
        try {
            const userId = req.user.id;
            // const { projectId } = req.query;
            const { projectId, remark } = req.body;
            
            const result = await projectService.deleteProject(userId, projectId, remark);
            logSuccess(result);
            sendSuccess(res, 200, result);
            
        } catch (error) {
            logError(error.message);
            const statusCode = error.statusCode || 500;
            sendError(res, statusCode, getFriendlyErrorMessage(error));
        }
    },

    getAllProjects: async (req, res) => {
        try {

            const result = await projectService.getAllProjects();
            logSuccess(result.message);
            sendSuccess(res, 200, result);
            
        } catch (error) {
            logError(error);
            sendError(res, 500, getFriendlyErrorMessage(error));
        }
    },

    hardDeleteProject: async (req, res) => {
        try {
            
            const { id } = req.query;

            const result = await projectService.hardDeleteProject(id);
            logSuccess(result.message);
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error);
            sendError(res, 500, getFriendlyErrorMessage(error));
        }
    },

    restoreProject: async (req, res) => {
        try {
            
            const userId = req.user.id;
            const { id } = req.body;

            const result = await projectService.restoreProject(userId, id);
            sendSuccess(res, 200, result);

        } catch (error) {
            logError(error);
            sendError(res, 500, getFriendlyErrorMessage(error));
        }
    }
}

module.exports = projectController; 