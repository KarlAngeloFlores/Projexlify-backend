const db = require('../config/db');

const accessModel = {
    insertProjectAccess: async (connection, userId, projectId, role) => {
        const query = `INSERT INTO projects_access (user_id, project_id, role) VALUES (?, ?, ?);`;
        const [result] = await connection.query(query, [userId, projectId, role]);
        return result;
    },

    findProjectAccess: async (userId, projectId) => {
        const query = `SELECT * FROM projects_access WHERE user_id = ? AND project_id = ?`;
        const [rows] = await db.query(query, [userId, projectId]);
        return rows[0];
    },

    updateProjectAccess: async (userId, projectId, newRole) => {
        const query = `
            UPDATE projects_access 
            SET role = ?
            WHERE user_id = ? AND project_id = ?
        `;
        const [result] = await db.query(query, [newRole, userId, projectId]);
        return result;
    },

    deleteProjectAccess: async (userId, projectId) => {
        const query = `
            DELETE FROM projects_access 
            WHERE user_id = ? AND project_id = ?
        `;
        const [result] = await db.query(query, [userId, projectId]);
        return result;
    },
    findSharedProject: async (userId) => {
        const query = `SELECT 
        pa.project_id,
        pa.role,
        p.name AS project_name,
        p.description,
        p.created_at,
        p.updated_at
        FROM projects_access pa
        JOIN projects p ON pa.project_id = p.id
        WHERE pa.user_id = ? AND pa.role != 'owner'`

        const [rows] = await db.query(query, [userId]);
        return rows; 
    }
    
};

module.exports = accessModel;