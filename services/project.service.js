const { Op } = require("sequelize");
const sequelize = require("../config/db");
const { Project , ProjectLog, ProjectAccess } = require('../models/associations');

const { logInfo } = require("../utils/logs.util");
const { throwError } = require("../utils/util");

const projectService = {
  createProject: async (name, description, userId) => {
    const transaction = await sequelize.transaction(); //start transaction

    try {
      const newStatus = "planned";

      //create project
      const project = await Project.create(
        {
          name,
          description,
          status: newStatus,
          user_id: userId,
        },
        {transaction }
      );

      //create project log
      await ProjectLog.create(
        {
          project_id: project.id,
          old_status: null,
          new_status: newStatus,
          remark: null,
          updated_by: userId,
        },
        {transaction }
      );

      //create project access
      await ProjectAccess.create(
        {
          user_id: userId,
          project_id: project.id,
          role: "owner",
        },
        { transaction }
      );

      await transaction.commit();

      return {
        message: "Project created successfully",
        project,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  updateProject: async (
    userId,
    projectId,
    name,
    description,
    newStatus,
    remark
  ) => {
    const transaction = await sequelize.transaction();
    try {
      const project = await Project.findOne({
        where: { id: projectId, status: { [Op.ne]: "deleted" } },
        transaction,
      });

      if (!project) {
        throwError("Project not found", 404, true);
      }

      if (
        project.name === name &&
        project.description === description &&
        project.status === newStatus
      ) {
        throwError("You must change input fields", 400, true);
      }

      const oldStatus = project.status || null;

      // Update project
      await Project.update(
        { name, description, status: newStatus },
        { where: { id: projectId }, transaction }
      );

      // Insert into project_logs
      await ProjectLog.create(
        {
          project_id: projectId,
          old_status: oldStatus,
          new_status: newStatus,
          remark,
          updated_by: userId,
        },
        { transaction }
      );

      const updatedProject = await Project.findOne({
        where: { id: projectId },
        transaction,
      });

      await transaction.commit();

      return {
        message: "Project updated successfully",
        project: updatedProject,
      };
    } catch (error) {
      await transaction.rollback();

      if (!error.isUserFriendly) {
        error.isUserFriendly = false;
      }

      throw error;
    }
  },

  getProjectsByUser: async (userId) => {
    try {
      const projects = await Project.findAll({
        where: {
          user_id: userId,
          status: { [Op.ne]: "deleted" },
        },
      });

      return {
        message: "Projects fetched successfully",
        data: projects || [],
      };
    } catch (error) {
      throw error;
    }
  },

  getProjectByProjectId: async (projectId) => {
    try {
      const project = await Project.findOne({
        where: { id: projectId, status: { [Op.ne]: "deleted" } },
      });

      if (!project) {
        throwError("Project not found", 404);
      }

      return {
        message: "Project fetched successfully",
        data: project,
      };
    } catch (error) {
      throw error;
    }
  },

  deleteProject: async (userId, projectId, remark) => {
    const transaction = await sequelize.transaction();
    try {
      const project = await Project.findOne({
        where: { id: projectId },
        transaction,
      });

      if (!project) {
        throwError("Project not found", 404, true);
      }

      if (!remark || remark.trim() === "") {
        throwError("Remark is required upon deleting a project", 400, true);
      }

      const old_status = project.status;
      const new_status = "deleted";

      await Project.update(
        { status: new_status },
        { where: { id: projectId }, transaction }
      );

      await ProjectLog.create(
        {
          project_id: projectId,
          old_status,
          new_status,
          remark,
          updated_by: userId,
        },
        { transaction }
      );

      await transaction.commit();

      return {
        message: "Project deleted successfully",
        projectId,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  getAllProjects: async () => {
    try {

      const projects = await Project.findAll({ where: { status: { [Op.ne]: "deleted" } } });
      
      return {
        message: 'All projects fetched successfully',
        data: projects
      }
      
    } catch (error) {
      throw error;
    }
  }
};

module.exports = projectService;
