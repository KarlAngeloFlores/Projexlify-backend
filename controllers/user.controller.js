const { logInfo, logSuccess, logError } = require("../utils/logs.util");
const {
  sendError,
  sendSuccess,
  getFriendlyErrorMessage,
} = require("../utils/util");
const userService = require("../services/user.service");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const result = await userService.getAllUsers();
      logSuccess(result.message);
      sendSuccess(res, 200, result);
    } catch (error) {
      logError(error);
      sendError(res, 500, getFriendlyErrorMessage(error));
    }
  },

  getUser: async (req, res) => {
    try {
      const userId = req.user.id;

      const result = await userService.getUser(userId);
      logSuccess(result.message);
      sendSuccess(res, 200, result);
    } catch (error) {
      logError(error.message);
      const status = error.statusCode || 500;
      sendError(res, status, getFriendlyErrorMessage(error));
    }
  },

  updateUser: async (req, res) => {
    try {
      
      const { id, username } = req.body;
      
      const result = await userService.updateUser(id, username);
      logSuccess(result.message);
      sendSuccess(res, 200, result);

    } catch (error) {
      logError(error.message);
      const status = error.statusCode || 500;
      sendError(res, status, getFriendlyErrorMessage(error));
    }
  },

  deleteUser: async (req, res) => {
    try {

      const { id } = req.query;
      const result = await userService.deleteUser(id);
      logSuccess(result.message);
      sendSuccess(res, 200, result);
      
    } catch (error) {
      logError(error.message);
      const status = error.statusCode || 500;
      sendError(res, status, getFriendlyErrorMessage(error));
    }
  }

  
};

module.exports = userController;
