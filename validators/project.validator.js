const { sendError } = require('../utils/util');
const { isValidId, PROJECT_VALID_STATUSES } = require('../utils/validator.util');

const projectValidator = {
    createProject: (req, res, next) => {
        const { name, description } = req.body;

        if (!name || name.trim().length < 3) {
            return sendError(res, 400, "Project name must be at least 3 characters long");
        }

        if (!description || description.trim().length < 10) {
            return sendError(res, 400, "Project description must be at least 10 characters long");
        }

        next();
    },

    updateProject: (req, res, next) => {
        const { projectId, name, description, newStatus, remark } = req.body;

        if (!isValidId(projectId)) {
            return sendError(res, 400, "Valid Project ID is required");
        }

        if (name && name.trim().length < 3) {
            return sendError(res, 400, "Project name must be at least 3 characters long");
        }

        if (description && description.trim().length < 10) {
            return sendError(res, 400, "Project description must be at least 10 characters long");
        }

        if (newStatus && !PROJECT_VALID_STATUSES.includes(newStatus)) {
            return sendError(res, 400, "Invalid project status");
        }

        if (!remark || remark.trim().length < 5) {
            return sendError(res, 400, "Remark is required and must be at least 5 characters long");
        }

        next();
    },

    getProjectByProjectId: (req, res, next) => {
        const { projectId } = req.query;

        if (!isValidId(projectId)) {
            return sendError(res, 400, "Valid Project ID is required");
        }

        next();
    },

    deleteProject: (req, res, next) => {
        const { projectId, remark } = req.body;

        if (!isValidId(projectId)) {
            return sendError(res, 400, "Valid Project ID is required");
        }

        if (!remark || remark.trim().length < 5) {
            return sendError(res, 400, "Remark is required and must be at least 5 characters long");
        }

        next();
    },

    hardDeleteProject: (req, res, next) => {
        const { id } = req.query;

        if (!isValidId(id)) {
            return sendError(res, 400, "Valid Project ID is required");
        }

        next();
    },

    restoreProject: (req, res, next) => {
        const { id } = req.body;

        if (!isValidId(id)) {
            return sendError(res, 400, "Valid Project ID is required");
        }

        next();
    }
};

module.exports = projectValidator;
