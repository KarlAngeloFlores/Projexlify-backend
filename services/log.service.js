const sequelize = require('../config/db');
const { User, ProjectLog, TaskLog, Task } = require('../models/associations');
const { throwError } = require('../utils/util');

const logService = {
    
    /**
     * not fully required since I already put a log status change upon creating, updating, deleting a project. -> just incase needed.
     * @protected
     * */

    createProjectChangeLog: async (projectId, oldStatus = null, newStatus, remark, userId) => {
        const transaction = await sequelize.transaction();
        try {          
            await ProjectLog.create({
                project_id: projectId,
                old_status: oldStatus, 
                new_status: newStatus, 
                remark,
                user_id: userId
            }, { transaction });

            await transaction.commit();

            return { message: "Project log created successfully" };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
    
    /**
     * not fully required since I already put a log status change upon creating, updating, deleting a task on a project. -> just incase needed.
     * @protected
     * */
    createTaskChangeLog: async (taskId, oldStatus = null, newStatus, remark, userId) => {
        const transaction = await sequelize.transaction();
        try {
            
            await TaskLog.create({ 
                task_id: taskId,
                old_status: oldStatus,
                new_status: newStatus,
                remark,
                user_id: userId
             }, { transaction });

            await transaction.commit();

            return { message: "Task log created successfully" };

        } catch (error) {
            await transaction.rollback();
            throw error;
        } 
    }, 
    
    getProjectHistory: async (projectId) => {
        try {

            const logs = await ProjectLog.findAll({
                attributes: ['id', 'old_status', 'new_status', 'remark', 'created_at'],
                include: [
                    {
                        model: User,
                        attributes: ['username']
                    },
                ],
                where: { project_id: projectId },
                order: [['created_at', 'ASC']]
            });

            const cleanLogs = logs.map(log => ({
                id: log.id,
                old_status: log.old_status,
                new_status: log.new_status,
                remark: log.remark,
                created_at: log.created_at,
                updated_by: log.User?.username || null
            }));

            return {
                message: 'Project history fetched successfully',
                data: cleanLogs || []
            };

        } catch (error) {
            throw error;
        }
    },

    getTasksHistoryByProject: async (projectId) => {
        try {
            const logs = await TaskLog.findAll({
                attributes: ['id', 'task_id', 'old_status', 'new_status', 'remark', 'created_at'],
                include: [
                    {
                        model: Task,
                        attributes: ['name'],
                    },
                    {
                        model: User,
                        attributes: ['username']
                    }
                ],
                where: { project_id: projectId },
                order: [['created_at', 'ASC']]
            });

            const cleanLogs = logs.map(log => ({
                id: log.id, 
                task_id: log.task_id,
                old_status: log.old_status, 
                new_status: log.new_status,
                remark: log.remark,
                created_at: log.created_at,
                updated_by: log.User?.username || null,
                task_name: log.Task?.name || null
            }))

            return {
                message: 'Tasks history fetched successfully',
                data: cleanLogs || []
            };

        } catch (error) {
            throw error;
        }
    }
};

module.exports = logService;