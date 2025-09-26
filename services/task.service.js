const { Op, fn, col } = require('sequelize');
const sequelize = require('../config/db');
const { logInfo } = require('../utils/logs.util');
const { throwError } = require('../utils/util');
const { Project, Task, TaskLog} = require('../models/associations')


const taskService = {
    createTask: async (userId, projectId, name, status, contents) => {
        const transaction = await sequelize.transaction();

        try {

        const project = await Project.findOne({ where: { id: projectId, status: { [Op.ne]: "deleted" } }, transaction });

        if(!project) {
            throwError('Project not found', 404, true); // User-friendly
        }
        
        if(project.status === 'deleted') {
            throwError('Cannot create task in a deleted project', 400, true); // User-friendly
        }

        const resultRow = await Task.findOne({
            where: {
            project_id: projectId,
            status: status,
        },
        attributes: [
        [fn("COALESCE", fn("MAX", col("position")), -1), "maxPos"]
    ],
        raw: true,
        }, {transaction});

        const task = await Task.create({ 
            project_id: projectId, 
            name,
            status: status,
            position: resultRow.nextPos,
            contents
         }, { transaction });

         const oldStatus = null;
         const remark = null;

         //add task log
         await TaskLog.create({ 
            task_id: task.id,
            project_id: projectId,
            old_status: oldStatus,
            new_status: status,
            remark,
            updated_by: userId
          }, { transaction })

        await transaction.commit();

        return {
            message: 'Task created successfully',
            task
        }
            
        } catch (error) {
            await transaction.rollback();
            throw error;  
        };

    },

    getTasksByProject: async (projectId) => {
        try {
            
            const project = await Project.findOne({ where: { id: projectId, status: { [Op.ne]: "deleted" } } });

            if(!project) {
                throwError('Project not found', 404, true);
            };

            const data = await Task.findAll({ where: { project_id: projectId, status: { [Op.ne]: "deleted" } }});
            
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
            
            const data = await Task.findOne({ where: { id: taskId } });
            
            if(!data) {
                throwError('Task not found', 404, true);
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
const transaction = await sequelize.transaction();

  try {
    const project = await Project.findOne({
      where: { id: projectId, status: { [Op.ne]: "deleted" } },
      transaction,
    });

    if (!project) {
      throwError("Project not found", 404, true);
    }

    const currentTask = await Task.findOne({
      where: { id: taskId, project_id: projectId, status: { [Op.ne]: "deleted" } },
      transaction,
    });

    if (!currentTask) {
      throwError("Task not found", 404, true);
    }

    const oldStatus = currentTask.status;

    if (
      currentTask.name === name &&
      currentTask.contents === contents &&
      currentTask.status === newStatus
    ) {
      throwError("No changes detected. Task not updated", 400, true);
    }

    // Optional: Require remark if status changes
    // if (oldStatus !== newStatus && (!remark || remark.trim() === "")) {
    //   throwError("Remark is required when changing task status.", 400, true);
    // }

    await Task.update(
      { name, contents, status: newStatus },
      { where: { id: taskId }, transaction }
    );

    const log = await TaskLog.create(
      {
        task_id: taskId,
        project_id: projectId,
        old_status: oldStatus,
        new_status: newStatus,
        remark,
        updated_by: userId,
      },
      { transaction }
    );

    const updatedTask = await Task.findOne({
      where: { id: taskId },
      transaction,
    });

    await transaction.commit();

    return {
      message: "Task updated successfully",
      updated_task: updatedTask,
      updated_log: log,
    };
  } catch (error) {
    await transaction.rollback();

    if (!error.isUserFriendly) {
      error.isUserFriendly = false;
    }

    throw error;
  }
    },

    deleteTask: async (userId, taskId, projectId, remark) => {
          const transaction = await sequelize.transaction();

  try {
    const project = await Project.findOne({
      where: { id: projectId, status: { [Op.ne]: "deleted" } },
      transaction,
    });

    if (!project) {
      throwError("Project not found", 404, true);
    }

    const task = await Task.findOne({
      where: { id: taskId, project_id: projectId },
      transaction,
    });

    if (!task) {
      throwError("Task not found", 404, true);
    }

    if (task.status === "deleted") {
      throwError("Task is already deleted", 400, true);
    }

    if (!remark || remark.trim() === "") {
      throwError("Remark is required upon deleting a task", 400, true);
    }

    const oldStatus = task.status;
    const newStatus = "deleted";

    await Task.update(
      { status: newStatus },
      { where: { id: taskId }, transaction }
    );

    await TaskLog.create(
      {
        task_id: taskId,
        project_id: projectId,
        old_status: oldStatus,
        new_status: newStatus,
        remark,
        updated_by: userId,
      },
      { transaction }
    );

    await transaction.commit();

    return {
      message: "Task deleted successfully",
      task_id: taskId,
    };
  } catch (error) {
    await transaction.rollback();

    if (!error.isUserFriendly) {
      error.isUserFriendly = false;
    }

    throw error;
  }
    },


    /**
     * @position reordering for dnd
     */

updateTaskStatus: async (tasks, taskId, newStatus, userId, projectId) => {

  const transaction = await sequelize.transaction();

  try {
    logInfo('PROJECTID: ', projectId);
    // find if it exists
    const task = await Task.findOne({ where: 
        { id: taskId, status: { [Op.ne]: "deleted" } } });

    if (!task) { throwError("Task not found", 400, true) };
    const oldStatus = task.status;

    if(oldStatus === newStatus) {
        return { message: "No changes made through DND" };
    };

    const remark = "moved thru dnd";

    for (const t of tasks) {
      await Task.update(
        { status: t.status, position: t.position },
        { where: { id: t.id }, transaction }
      );
    }

    await TaskLog.create(
      {
        task_id: taskId,
        project_id: projectId,
        old_status: oldStatus,
        new_status: newStatus,
        remark,
        updated_by: userId,
      },
      { transaction }
    );

    await transaction.commit();

    return { message: "Changed task status through DND" };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

}

module.exports = taskService;