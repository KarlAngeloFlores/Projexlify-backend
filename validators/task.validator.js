const { sendError } = require("../utils/util");
const { isValidId, isValidArray, TASK_VALID_STATUSES } = require("../utils/validator.util");

const taskValidator = {
  createTask: (req, res, next) => {
    const { projectId, name, status, contents } = req.body;

    if (!isValidId(projectId)) {
      return sendError(res, 400, "Invalid or missing project ID");
    }
    if (!name || typeof name !== "string" || name.trim().length < 3) {
      return sendError(res, 400, "Task name must be at least 3 characters");
    }
    if (!status || !TASK_VALID_STATUSES.includes(status)) {
      return sendError(res, 400, `Status must be one of: ${TASK_VALID_STATUSES.join(", ")}`);
    }
    if (contents && typeof contents !== "string") {
      return sendError(res, 400, "Contents must be a string");
    }
    next();
  },

  getTasksByProject: (req, res, next) => {
    const { projectId } = req.query;

    if (!isValidId(projectId)) {
      return sendError(res, 400, "Invalid or missing project ID");
    }
    next();
  },

  getTaskByTaskId: (req, res, next) => {
    const { taskId } = req.query;

    if (!isValidId(taskId)) {
      return sendError(res, 400, "Invalid or missing task ID");
    }
    next();
  },

  updateTask: (req, res, next) => {
    const { projectId, taskId, name, contents, newStatus } = req.body;

    if (!isValidId(projectId)) {
      return sendError(res, 400, "Invalid project ID");
    }
    if (!isValidId(taskId)) {
      return sendError(res, 400, "Invalid task ID");
    }
    if (name && (typeof name !== "string" || name.trim().length < 3)) {
      return sendError(res, 400, "Task name must be at least 3 characters");
    }
    if (contents && typeof contents !== "string") {
      return sendError(res, 400, "Contents must be a string");
    }
    if (newStatus && !TASK_VALID_STATUSES.includes(newStatus)) {
      return sendError(res, 400, `newStatus must be one of: ${TASK_VALID_STATUSES.join(", ")}`);
    }
    next();
  },

  deleteTask: (req, res, next) => {
    const { taskId, projectId, remark } = req.body;

    if (!isValidId(taskId)) {
      return sendError(res, 400, "Invalid task ID");
    }
    if (!isValidId(projectId)) {
      return sendError(res, 400, "Invalid project ID");
    }

    if (!remark || remark.trim().length < 5) {
        return sendError(res, 400, "Remark is required and must be at least 5 characters long");
    }

    next();
  },

  updateTaskStatus: (req, res, next) => {
    const { tasks, taskId, newStatus, projectId } = req.body;

    if (!isValidArray(tasks)) {
      return sendError(res, 400, "Tasks must be a valid array");
    }
    if (!isValidId(taskId)) {
      return sendError(res, 400, "Invalid task ID");
    }
    if (!isValidId(projectId)) {
      return sendError(res, 400, "Invalid project ID");
    }
    if (!newStatus || !TASK_VALID_STATUSES.includes(newStatus)) {
      return sendError(res, 400, `newStatus must be one of: ${TASK_VALID_STATUSES.join(", ")}`);
    }
    next();
  }
};

module.exports = taskValidator;
