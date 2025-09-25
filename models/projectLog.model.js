const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const Project = require('./project.model');

const ProjectLog = sequelize.define(
  "ProjectLog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: "id",
      },
      onDelete: "CASCADE"
    },

    old_status: {
      type: DataTypes.ENUM("planned", "active", "completed", "deleted"),
      allowNull: true,
    },

    new_status: {
      type: DataTypes.ENUM("planned", "active", "completed", "deleted"),
      allowNull: true,
    },

    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true, // can be null if user is deleted
      references: {
        model: User,
        key: "id"
      },
      onDelete: "SET NULL"
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "project_logs",
    timestamps: false,
  }
);

module.exports = ProjectLog;