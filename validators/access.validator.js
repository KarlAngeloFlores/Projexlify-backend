const { sendError } = require("../utils/util");
const { isValidId, isValidEmail } = require("../utils/validator.util");

const validRoles = ["write", "read"];

const accessValidator = {
  giveAccess: (req, res, next) => {
    const { email, projectId, role } = req.body;

    if (!email || !isValidEmail(email)) {
      return sendError(res, 400, "Invalid email");
    }
    if (!projectId || !isValidId(projectId)) {
      return sendError(res, 400, "Invalid project ID");
    }
    if (!role || !validRoles.includes(role)) {
      return sendError(res, 400, "Invalid role");
    }

    next();
  },

  updateAccess: (req, res, next) => {
    const { userId, projectId, role } = req.body;

    if (!userId || !isValidId(userId)) {
      return sendError(res, 400, "Invalid user ID");
    }
    if (!projectId || !isValidId(projectId)) {
      return sendError(res, 400, "Invalid project ID");
    }
    if (!role || !validRoles.includes(role)) {
      return sendError(res, 400, "Invalid role");
    }

    next();
  },

  removeAccess: (req, res, next) => {
    const { userId, projectId } = req.body;

    if (!userId || !isValidId(userId)) {
      return sendError(res, 400, "Invalid user ID");
    }
    if (!projectId || !isValidId(projectId)) {
      return sendError(res, 400, "Invalid project ID");
    }

    next();
  },
};

module.exports = accessValidator;
