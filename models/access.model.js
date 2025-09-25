const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const Project = require("./project.model");

const ProjectAccess = sequelize.define(
  "ProjectAccess",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: "id"
      },
      onDelete: "CASCADE"
    },
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Project,
        key: "id"
      },
      onDelete: "CASCADE"
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "read",
    },
  },
  {
    tableName: "projects_access",
    timestamps: false, // your table doesn’t have createdAt/updatedAt
  }
);

module.exports = ProjectAccess;


//     findSharedProject: async (userId) => {
//         const query = `SELECT 
//         pa.project_id,
//         pa.role,
//         p.name AS project_name,
//         p.description,
//         p.created_at,
//         p.updated_at
//         FROM projects_access pa
//         JOIN projects p ON pa.project_id = p.id
//         WHERE pa.user_id = ? AND pa.role != 'owner'`

//         const [rows] = await db.query(query, [userId]);
//         return rows; 
//     }