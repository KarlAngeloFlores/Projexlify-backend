// models/log.model.js
const db = require('../config/db');

const logModel = {
    findProjectLogsByUser: async (projectId, userId) => {
        const [rows] = await db.query(
            `SELECT pl.id, pl.old_status, pl.new_status, pl.remark, pl.created_at, u.username AS updated_by
             FROM project_logs pl
             JOIN users u ON pl.updated_by = u.id
             WHERE pl.project_id = ? AND pl.updated_by = ?
             ORDER BY pl.created_at ASC`,
            [projectId, userId]
        );
        return rows;
    },

    findTasksLogsByProject: async (projectId) => {
        const [rows] = await db.query(
            `SELECT tl.id, tl.task_id, t.name AS task_name, tl.old_status, tl.new_status, tl.remark, tl.created_at, u.username AS updated_by
             FROM task_logs tl
             JOIN tasks t ON tl.task_id = t.id
             JOIN users u ON tl.updated_by = u.id
             WHERE t.project_id = ?
             ORDER BY tl.created_at ASC;`,
            [projectId]
        );
        return rows;
    },
};

module.exports = logModel;
