const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Project = require("./project.model");
const Task = require("./task.model");
const User = require("./user.model");

const TaskLog = sequelize.define("TaskLog", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Task,
        key: "id"
    }, 
    onDelete: "CASCADE"
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
        model: Project,
        key: "id"
    },
    onDelete: "SET NULL"
  },
  old_status: {
    type: DataTypes.ENUM("todo", "in_progress", "done", "deleted"),
    allowNull: true,
  },
  new_status: {
    type: DataTypes.ENUM("todo", "in_progress", "done", "deleted"),
    allowNull: true,
  },
  remark: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
}, {
  tableName: "task_logs",
  timestamps: false,
});

module.exports = TaskLog;
