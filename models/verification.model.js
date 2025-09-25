const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");

const VerificationCode = sequelize.define("VerificationCode", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  code_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  purpose: {
    type: DataTypes.ENUM("account_verification", "password_reset"),
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "verification_codes",
  timestamps: false,
});

module.exports = VerificationCode;
