const { sendError } = require("../utils/util");
const { isValidId } = require("../utils/validator.util");

const userValidator = {
  getUser: (req, res, next) => {
    const userId = req.user?.id;
    if (!isValidId(userId)) {
      return sendError(res, 400, "Invalid or missing user ID");
    }
    next();
  },

  updateUser: (req, res, next) => {
    const { id, username } = req.body;

    if (!isValidId(id)) {
      return sendError(res, 400, "Invalid or missing user ID");
    }

    if (!username || typeof username !== "string" || username.trim().length < 3) {
      return sendError(res, 400, "Username must be at least 3 characters long");
    }

    next();
  },

  deleteUser: (req, res, next) => {
    const { id } = req.query;

    if (!isValidId(id)) {
      return sendError(res, 400, "Invalid or missing user ID");
    }

    next();
  }
};

module.exports = userValidator;
