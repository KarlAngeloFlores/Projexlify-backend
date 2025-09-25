//models
const User = require("./user.model");
const VerificationCode = require("./verification.model");
const Project = require("./project.model");
const ProjectLog = require("./projectLog.model");
const ProjectAccess = require('./access.model');

const Task = require("./task.model");
const TaskLog = require("./taskLog.model");

//Verification code
User.hasMany(VerificationCode, { foreignKey: "user_id", onDelete: "CASCADE" });
VerificationCode.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

//User Project
User.hasMany(Project, { foreignKey: "user_id", onDelete: "CASCADE" });
Project.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

//Project ProjectLog
Project.hasMany(ProjectLog, { foreignKey: "project_id", onDelete: "CASCADE" });
ProjectLog.belongsTo(Project, { foreignKey: "project_id", onDelete: "CASCADE" });

//User  ProjectLog (updated_by)
User.hasMany(ProjectLog, { foreignKey: "updated_by", onDelete: "SET NULL" });
ProjectLog.belongsTo(User, { foreignKey: "updated_by", onDelete: "SET NULL" });

//Project  Task
Project.hasMany(Task, { foreignKey: "project_id", onDelete: "CASCADE" });
Task.belongsTo(Project, { foreignKey: "project_id", onDelete: "CASCADE" });

//Task  TaskLog
Task.hasMany(TaskLog, { foreignKey: "task_id", onDelete: "CASCADE" });
TaskLog.belongsTo(Task, { foreignKey: "task_id", onDelete: "CASCADE" });

//User  TaskLog (updated_by)
User.hasMany(TaskLog, { foreignKey: "updated_by", onDelete: "SET NULL" });
TaskLog.belongsTo(User, { foreignKey: "updated_by", onDelete: "SET NULL" });

//Project  TaskLog (extra link since project_id exists in task_logs)
Project.hasMany(TaskLog, { foreignKey: "project_id", onDelete: "SET NULL" });
TaskLog.belongsTo(Project, { foreignKey: "project_id", onDelete: "SET NULL" });

//Project  User through ProjectAccess
Project.hasMany(ProjectAccess, { foreignKey: "project_id", onDelete: "CASCADE" });
ProjectAccess.belongsTo(Project, { foreignKey: "project_id", onDelete: "CASCADE" });

User.hasMany(ProjectAccess, { foreignKey: "user_id", onDelete: "CASCADE" });
ProjectAccess.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

//Convenience many-to-many
User.belongsToMany(Project, { through: ProjectAccess, foreignKey: "user_id" });
Project.belongsToMany(User, { through: ProjectAccess, foreignKey: "project_id" });

//Exports
module.exports = {
  User, 
  VerificationCode,
  Project,
  ProjectLog,
  Task,
  TaskLog,
  ProjectAccess
};
