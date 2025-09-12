const db = require('../config/db');

const taskModel = {
    insertNewTask: async (connection, projectId, name, status, position, contents) => {
        const query = `INSERT INTO tasks (project_id, name, status, position, contents) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await connection.query(query, [projectId, name, status, position, contents]);
        return result;
    },
    insertTaskLogs: async (connection, taskId, projectId, oldStatus, newStatus, remark, userId) => {
        const query = `INSERT INTO task_logs (task_id, project_id, old_status, new_status, remark, updated_by) VALUES (?, ?, ?, ?, ?, ?);`;
        const [result] = await connection.query(query, [taskId, projectId, oldStatus, newStatus, remark, userId]);
        return result;
    },
    findTaskByTaskId: async (connection, taskId) => {
        const query = `SELECT * FROM tasks WHERE id = ? AND status != 'deleted';`;
        const [rows] = await connection.query(query, [taskId]);
        return rows[0];
    },
    findTasksByProjectId: async (connection, projectId) => {
        const query = `SELECT * FROM tasks WHERE project_id = ? AND status != 'deleted'`;
        const [rows] = await connection.query(query, [projectId]);
        return rows;
    },
    updateTask: async (connection, taskId, name, contents, newStatus) => {
        const query = `
            UPDATE tasks 
            SET name = ?, contents = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        const [result] = await connection.query(query, [name, contents, newStatus, taskId]);
        return result;
    },
    updateTaskStatus: async (connection, taskId, newStatus) => {
        const query = `UPDATE tasks SET status = ? WHERE id = ?`;
        const [result] = await connection.query(query, [newStatus, taskId]);
        return result;
    },
    updateTaskStatusByProjectId: async (connection, newStatus, projectId) => {
        const query = `UPDATE tasks SET status = ? WHERE project_id = ?`;
        const [result] = await connection.query(query, [newStatus, projectId]);
        return result;
    },
    findUpdatedTaskLog: async (connection, logId) => {
        const query = `SELECT * FROM task_logs WHERE id = ?`;
        const [rows] = await connection.query(query, [logId]);
        return rows[0];
    },

    /**
     * @position reordering for dnd
     */

    findNextPos: async (connection, projectId, status) => {
        const query = `SELECT COALESCE(MAX(position), -1) + 1 AS nextPos FROM tasks WHERE project_id = ? AND status = ?`;
        const [rows] = await connection.query(query, [projectId, status]);
        return rows[0];
       
    },

  updateTaskStatusAndPos: async (connection, taskId, newStatus, newPos) => {
    const query = `
      UPDATE tasks 
      SET status = ?, position = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    const [result] = await connection.query(query, [newStatus, newPos, taskId]);
    return result;
  }
}

module.exports = taskModel;