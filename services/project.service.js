//import db for transaction
const db = require('../config/db');
const projectModel = require('../models/project.model');
const taskModel = require('../models/task.model');
const accessModel = require('../models/access.model');
const { logInfo } = require('../utils/logs.util');
const { throwError } = require('../utils/util');

const projectService = {
    createProject: async (name, description, userId) => {
        let connection = await db.getConnection();
        
        try {

            const oldStatus = null;
            const newStatus = "planned";
            const remark = null;
            
            await connection.beginTransaction();
            
            const dataProject = await projectModel.insertNewProject(connection, name, description, newStatus, userId);
            const projectId = dataProject.insertId;

            const dataNewProject = await projectModel.findProjectByProjectId(connection, projectId);
    
            await projectModel.insertProjectLogs(connection, projectId, oldStatus, newStatus, remark, userId);
            await accessModel.insertProjectAccess(connection, userId, projectId, 'owner');
            
            await connection.commit();

            return {
                message: 'Project created succesffully',
                project: dataNewProject
            }

        } catch (error) {
            await connection.rollback();

            if (!error.isUserFriendly) {
            error.isUserFriendly = false;
            }

            throw  error;
        } finally {
            connection.release();
        }
    },

    updateProject: async (userId, projectId, name, description, newStatus, remark) => {
        let connection = await db.getConnection();
        try {
            const project = await projectModel.findProjectByProjectId(connection, projectId);

            if(!project) {
                throwError('Project not found', 404, true);
            };  

            if (
                project.name === name &&
                project.description === description &&
                project.status === newStatus
            ) {
                throwError('You must change input fields', 400, true);
            }

            const oldStatus = project.status || null;

            // if (oldStatus !== newStatus && (!remark || remark.trim() === "")) {
            //     throwError('Remark is required when changing project status.', 400, true);
            // };

            await connection.beginTransaction();

            await projectModel.updateProject(connection, projectId, name, description, newStatus);

            const insResult = await projectModel.insertProjectLogs(connection, projectId, oldStatus, newStatus, remark, userId)
            // const logId = insResult.insertId;
            
            const updatedProject = await projectModel.findProjectByProjectId(connection, projectId);
            // const updatedLog = await projectModel.findUpdatedProjectLog(connection, logId);
            
            await connection.commit();

            return {
                message: 'Project updated successfully',
                project: updatedProject      
            }
            
        } catch (error) {
            await connection.rollback();

            if (!error.isUserFriendly) {
                error.isUserFriendly = false;
            }
            
            throw error;
        } finally {
            connection.release();
        }
    },

    getProjectsByUser: async (userId) => {
        try {
            console.log('userid', userId)
            const projects = await projectModel.findProjectsByUserId(userId);

            return {
                message: 'Projects fetched successfully',
                data: projects || [],
            }
            
        } catch (error) {
            throw error;
        }
    },

    getProjectByProjectId: async (projectId) => {
        
        try {
            
            const project = await projectModel.findProjectByProjectId(db, projectId);
            
            if(!project) {
                throwError('Project not found', 404);
            }

            return {
                message: 'Project fetched successfully',
                data: project
            }

        } catch (error) {
            throw error;
        }
    }, 

    deleteProject: async (userId, projectId, remark) => {
        let connection = await db.getConnection();

        try {

            const project = await projectModel.findProjectByProjectId(connection, projectId);

            if(!project) {
                throwError('Project not found', 404, true);
            };

            if(!remark) {
                throwError('Remark is required upon deleting a project', 404, true);
            }

            await connection.beginTransaction();

            const oldStatus = project.status;
            const newStatus = 'deleted';

            await projectModel.updateProjectStatus(connection, newStatus, projectId);
            await projectModel.insertProjectLogs(connection, projectId, oldStatus, newStatus, remark, userId);

            await connection.commit();

            return {
                message: 'Project deleted successfully',
                projectId: projectId
            };

        } catch (error) {
            await connection.rollback();

            if (!error.isUserFriendly) {
            error.isUserFriendly = false;
            };
            
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = projectService;