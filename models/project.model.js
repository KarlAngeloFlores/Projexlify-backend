const db = require('../config/db');

const projectModel = {
    findProjectByProjectId: async (connection, projectId) => {
        const query = `SELECT * FROM projects WHERE id = ? AND status != 'deleted'`;
        const [rows] = await connection.query(query, [projectId]);
        return rows[0];
    },
    findProjectsByUserId: async (userId) => {
        const query = `SELECT * FROM projects WHERE user_id = ? AND status != 'deleted';`;
        const [rows] = await db.query(query, [userId]);
        return rows;
    },
    insertNewProject: async (connection, name, description, status, userId) => {
        const query = `INSERT INTO projects (name, description, status, user_id) VALUES (?, ?, ?, ?);`;
        const [result] = await connection.query(query, [name, description, status, userId]);
        return result;
    },
    updateProject: async (connection, projectId, name, description, status) => {
        const query = `UPDATE projects SET name = ?, description = ?, status = ?, updated_at = NOW() WHERE id = ?;`;
        const [result] = await connection.query(query, [name, description, status, projectId]);
        return result;
    },
    updateProjectStatus: async (connection, newStatus, projectId) => {
        const query = `UPDATE projects SET status = ? WHERE id = ?`;
        const [result] = await connection.query(query, [newStatus, projectId]);
        return result;
        },
    insertProjectLogs: async (connection, projectId, oldStatus, newStatus, remark, updatedBy) => {
        const query = `INSERT INTO project_logs (project_id, old_status, new_status, remark, updated_by, created_at) VALUES (?, ?, ?, ?, ?, NOW());`;
        const [result] = await connection.query(query, [projectId, oldStatus, newStatus, remark, updatedBy]);
        return result;
    },
    findUpdatedProjectLog: async (connection, logId) => {
        const query = `SELECT * FROM project_logs WHERE id = ?`;
        const [rows] = await connection.query(query, [logId]);
        console.log(rows);
        return rows[0];
    },
    findSharedProjectsByUserId: async (userId) => {
        const query = `
        SELECT p.*
        FROM projects p
        JOIN projects_access pa ON p.id = pa.project_id
        WHERE pa.user_id = ?
        `;

        const [rows] = await db.query(query, [userId]);
        return rows;
    },
    insertProjectAccess: async (connection, userId, projectId, access) => {
        const query = `INSERT INTO projects_access (user_id, project_id, role) VALUES (?, ?, ?);`;
        const [result] = await connection.query(query, [userId, projectId, access]);
        return result;
    },
    findProjectAccess: async (userId, projectId) => {
        const query = `SELECT * FROM projects_access WHERE user_id = ? AND project_id = ?`;
        const [rows] = await db.query(query, [userId, projectId]);
        return rows[0];
    },
}

module.exports = projectModel;