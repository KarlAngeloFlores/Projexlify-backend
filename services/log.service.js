const logModel = require('../models/log.model');
const projectModel = require('../models/project.model');
const taskModel = require('../models/task.model');
const { throwError } = require('../utils/util');
const db = require('../config/db');

const logService = {
    
    /**
     * not fully required since I already put a log status change upon creating, updating, deleting a project. -> just incase needed.
     * @protected
     * */

    createProjectChangeLog: async (projectId, oldStatus = null, newStatus, remark, userId) => {
        let connection = await db.getConnection();
        try {
            
            await connection.beginTransaction();

            await projectModel.insertProjectLogs(connection, projectId, oldStatus, newStatus, remark, userId);

            await connection.commit();

            return { message: "Project log created successfully" };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
    
    /**
     * not fully required since I already put a log status change upon creating, updating, deleting a task on a project. -> just incase needed.
     * @protected
     * */
    createTaskChangeLog: async (taskId, oldStatus = null, newStatus, remark, userId) => {
        let connection = await db.getConnection();
        try {
            
            await connection.beginTransaction();

            await taskModel.insertTaskLogs(connection, taskId, oldStatus, newStatus, remark, userId);

            await connection.commit();

            return { message: "Task log created successfully" };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }, 
    
    getProjectHistoryByUser: async (projectId, userId) => {
        try {

            const logs = await logModel.findProjectLogsByUser(projectId, userId);

            return {
                message: 'Project history fetched successfully',
                data: logs || []
            };

        } catch (error) {
            throw error;
        }
    },
    getTasksHistoryByProject: async (projectId) => {
        try {
            const logs = await logModel.findTasksLogsByProject(projectId);

            return {
                message: 'Tasks history fetched successfully',
                data: logs || []
            };

        } catch (error) {
            throw error;
        }
    }
};

module.exports = logService;