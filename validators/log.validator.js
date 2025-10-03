const { sendError } = require("../utils/util");
const { isValidId, TASK_VALID_STATUSES, PROJECT_VALID_STATUSES } = require("../utils/validator.util");

const logValidator = {
  createProjectChangeLog: (req, res, next) => {
    const { projectId, oldStatus, newStatus, remark } = req.body;
    const userId = req.user?.id;

    if (!isValidId(userId)) {
      return sendError(res, 400, "Invalid user ID");
    }
    if (!isValidId(projectId)) {
      return sendError(res, 400, "Invalid project ID");
    }
    if (!PROJECT_VALID_STATUSES.includes(oldStatus)) {
      return sendError(res, 400, "Invalid old status");
    }
    if (!PROJECT_VALID_STATUSES.includes(newStatus)) {
      return sendError(res, 400, "Invalid new status");
    }
    if (!remark || typeof remark !== "string") {
      return sendError(res, 400, "Remark is required");
    }

    next();
  },

  createTaskChangeLog: (req, res, next) => {
    const { taskId, oldStatus, newStatus, remark } = req.body;
    const userId = req.user?.id;

    if (!isValidId(userId)) {
      return sendError(res, 400, "Invalid user ID");
    }
    if (!isValidId(taskId)) {
      return sendError(res, 400, "Invalid task ID");
    }
    if (!TASK_VALID_STATUSES.includes(oldStatus)) {
      return sendError(res, 400, "Invalid old status");
    }
    if (!TASK_VALID_STATUSES.includes(newStatus)) {
      return sendError(res, 400, "Invalid new status");
    }
    if (!remark || typeof remark !== "string") {
      return sendError(res, 400, "Remark is required");
    }

    next();
  },

  getProjectHistory: (req, res, next) => {
    const { projectId } = req.query;
    if (!isValidId(projectId)) {
      return sendError(res, 400, "Invalid project ID");
    }
    next();
  },

  getTasksHistoryByProject: (req, res, next) => {
    const { projectId } = req.query;
    if (!isValidId(projectId)) {
      return sendError(res, 400, "Invalid project ID");
    }
    next();
  },
};

module.exports = logValidator;
