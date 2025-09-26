require("dotenv").config();
const { Sequelize } = require("sequelize");
const clc = require("cli-color");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false, // set true if you want to see SQL queries
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log(clc.bgGreen.black("Connected to Database (Sequelize)"));
  } catch (error) {
    console.log(clc.red("DB Connection Error:", error.message));
    process.exit(1);
  }
})();

module.exports = sequelize;
