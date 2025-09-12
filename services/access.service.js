const db = require('../config/db');

const accessModel = require('../models/access.model');
const projectModel = require('../models/project.model');
const userModel = require('../models/user.model');

const { throwError } = require('../utils/util');

const accessService = {

    giveAccess: async (email, projectId, role) => {
        try {
  
            const user = await userModel.findUserByEmail(email);
            
            if(!user) {
                throwError('User not found', 404, true);
            };
            
            const project = await projectModel.findProjectByProjectId(db, projectId);

            if(!project) {
                throwError('Project not found', 404, true);
            };

            const userId = user.id;

            const access = await accessModel.findProjectAccess(userId, projectId);
            
            //prevent owner from adding themselves
            if (access && access.role === "owner" && role === "owner") {
            throwError("You are already the owner of this project", 400, true);
            }

            const validRoles = ['write', 'read'];

            if(!validRoles.includes(role)) {
                throwError('Invalid role', 400, true);
            }

            if(!access) {
                await accessModel.insertProjectAccess(db, userId, projectId, role);
            } else {
                throwError('User already has access to this project', 400, true);
            };

            return {
                message: 'Access granted successfully'
            }

        } catch (error) {
            throw error;
        };
    }, 

    updateAccess: async (userId, projectId, newRole) => {
        try {
            const access = await accessModel.findProjectAccess(userId, projectId);

            if (!access) {
                throwError('Access not found', 404, true);
            }

            if (access.role === 'owner' && newRole === 'owner') {
                throwError('User is already the owner of this project', 400, true);
            }

            if (access.role === 'owner' && newRole !== 'owner') {
                throwError('Cannot change role of the project owner', 403, true);
            }

            const validRoles = ['write', 'read'];
            if (!validRoles.includes(newRole)) {
                throwError('Invalid role', 400, true);
            }

            await accessModel.updateProjectAccess(userId, projectId, newRole);

            return { message: 'Access updated successfully' };
        } catch (error) {
            throw error;
        }
    },
    
    removeAccess: async (userId, projectId) => {
        try {
            const access = await accessModel.findProjectAccess(userId, projectId);

            if (!access) {
                throwError('Access not found', 404, true);
            }

            if (access.role === 'owner') {
                throwError('Cannot remove the project owner', 403, true);
            }

            await accessModel.deleteProjectAccess(userId, projectId);

            return { message: 'Access removed successfully' };
        } catch (error) {
            throw error;
        }
    },

    getSharedProjects: async (userId) => {
        try {
            
            const data = await accessModel.findSharedProject(userId);

            return {
                message: 'Fetched shared project successfully',
                data: data || []
            }

        } catch (error) {
            throw error;
        }
    }

};

module.exports = accessService;