const { Op } = require("sequelize");
const { User } = require("../models/associations");
const { throwError } = require("../utils/util");


const userService = {
  getAllUsers: async () => {
    try {
      const users = await User.findAll({
        where: { role: { [Op.ne]: "admin" } },
        attributes: { exclude: ["password", "role"] },
      });

      return {
        message: "Users fetched successfully.",
        data: users,
      };
    } catch (error) {
      throw error;
    }
  },

  getUser: async (id) => {
    try {
      const user = await User.findOne({
        where: { id },
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        throwError("User not found", 404, true);
      }

      return {
        message: "User found",
        data: user,
      };
    } catch (error) {
      throw error;
    }
  },

updateUser: async (id, username) => {
  try {

    const existingUser = await User.findOne({ where: { username }, attributes: ["id"] });

    if (existingUser && existingUser.id !== id) {
      throwError("Username already exists.", 400, true);
    }

    await User.update(
      { username },
      { where: { id } }
    );

    const updatedUser = await User.findOne({
      where: { id },
      attributes: { exclude: ['password'] }
    });

    return {
      message: 'User updated successfully',
      data: updatedUser
    };
  } catch (error) {
    throw error;
  }
},

  deleteUser: async (id) => {
    try {

      const user = await User.findByPk(id);

      if (!user) {
        throwError("User not found", 404, true);
      }

      await user.destroy();

      return {
        message: 'User deleted successfully', 
        user_id: id
      }

    } catch (error) {
      throw error;
    }
  },
};

module.exports = userService;
