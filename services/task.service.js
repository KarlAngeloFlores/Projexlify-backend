const db = require('../config/db');
const projectModel = require('../models/project.model');
const taskModel = require('../models/task.model');
const { logInfo } = require('../utils/logs.util');
const { throwError } = require('../utils/util');

const taskService = {
createTask: async (userId, projectId, name, status, contents) => {
    let connection = await db.getConnection();

    try {
        const project = await projectModel.findProjectByProjectId(connection, projectId);
        
        if(!project) {
            throwError('Project not found', 404, true); // User-friendly
        }
        
        if(project.status === 'deleted') {
            throwError('Cannot create task in a deleted project', 400, true); // User-friendly
        }

        const resultRow = await taskModel.findNextPos(connection, projectId, status);
        console.log(resultRow.nextPos);
        const nextPosition = resultRow.nextPos;

        await connection.beginTransaction();

        const resultNewTask = await taskModel.insertNewTask(connection, projectId, name, status, nextPosition, contents);
        const taskId = resultNewTask.insertId;

        const oldStatus = null;
        const remark = null;
        
        await taskModel.insertTaskLogs(connection, taskId, projectId, oldStatus, status, remark, userId);
        const dataTask = await taskModel.findTaskByTaskId(connection, taskId);

        await connection.commit();

        return {
            message: 'Task created successfully', 
            task: dataTask
        }

    } catch (error) {
        await connection.rollback();
        
        // If it's a database error or other technical error, mark as not user-friendly
        if (!error.isUserFriendly) {
            error.isUserFriendly = false;
        }
        
        throw error;
        
    } finally {
        connection.release();
    }
},
    getTasksByProject: async (projectId) => {
        try {
            
            const project = await projectModel.findProjectByProjectId(db, projectId);

            if(!project) {
                throwError('Project not found', 404, true);
            };

            const data = await taskModel.findTasksByProjectId(db, projectId);
            
            return {
                message: 'Tasks fetched successfully',
                tasks: data || []
            }
            
        } catch (error) {
            throw error;
        }
    },

    getTaskByTaskId: async (taskId) => {
        try {
            
            const data = await taskModel.findTaskByTaskId(db, taskId);
            
            if(!data) {
                throwError('Task not found', 400, true);
            }

            return {
                message: 'Task fetched sucessfully',
                data
            }

        } catch (error) {
            throw error;
        }
    },

    updateTask: async (projectId, taskId, name, contents, newStatus, userId, remark) => {
        let connection = await db.getConnection();

        try {
            
            const project = await projectModel.findProjectByProjectId(connection, projectId);

            if(!project) {
                throwError('Project not found', 404, true);
            };

            const currentTask = await taskModel.findTaskByTaskId(connection, taskId);
            logInfo(currentTask);
            if (!currentTask) {
                throwError('Task not found', 400, true);
            }            
            
            const oldStatus = currentTask.status;

            if (
            currentTask.name === name &&
            currentTask.contents === contents &&
            currentTask.status === newStatus
            ) {
            throwError("No changes detected. Task not updated", 400, true);
            }

            // if (oldStatus !== newStatus && (!remark || remark.trim() === "")) {
            //     throwError('Remark is required when changing project status.', 400, true);
            // };

            await connection.beginTransaction();

            // update task
            await taskModel.updateTask(connection, taskId, name, contents, newStatus);

            const resultLog = await taskModel.insertTaskLogs(connection, taskId, projectId, oldStatus, newStatus, remark, userId);

            const logId = resultLog.insertId;
            const updatedTask = await taskModel.findTaskByTaskId(connection, taskId);
            const updatedLog = await taskModel.findUpdatedTaskLog(connection, logId);

            await connection.commit();

            return {
                message: "Task updated successfully",
                updated_task: updatedTask,
                updated_log: updatedLog
            };

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
    deleteTask: async (userId, taskId, projectId, remark) => {
        let connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const project = await projectModel.findProjectByProjectId(connection, projectId);

            if (!project) {
                throwError('Project not found', 404, true);
            }

            const task = await taskModel.findTaskByTaskId(connection, taskId);
            
            if(!task) {
                throwError('Task not found', 404, true)
            };

            if(task.status === 'deleted') {
                throwError('Task is already deleted', 404, true)
            };

            if(!remark) {
                throwError('Remark is required upon deleting a task', 400, true);
            };

            const oldStatus = task.status;
            const newStatus = 'deleted';

            await taskModel.updateTaskStatus(connection, taskId, newStatus);

            await taskModel.insertTaskLogs(connection, taskId, projectId, oldStatus, newStatus, remark, userId);
            await connection.commit();

            return {
                message: 'Task deleted successfully',
                task_id: taskId
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


    /**
     * @position reordering for dnd
     */

updateTaskStatus: async (tasks, taskId, newStatus, userId, projectId) => {

let connection = await db.getConnection();

  try {
    logInfo('PROJECTID: ', projectId);
    // find if it exists
    const task = await taskModel.findTaskByTaskId(connection, taskId);
    if (!task) { throwError("Task not found", 400, true) };

    const oldStatus = task.status;

    if(oldStatus === newStatus) {
        // throwError('Nothing changed', 400, true);
        return;
    };

    const remark = "moved thru dnd";
    
    await connection.beginTransaction();

    for(const task of tasks) {
        await taskModel.updateTaskStatusAndPos(connection, task.id, task.status, task.position);
    }

    await taskModel.insertTaskLogs(connection, taskId, projectId, oldStatus, newStatus, remark, userId);

    await connection.commit();

    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

}

module.exports = taskService;