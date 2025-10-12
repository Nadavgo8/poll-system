require("dotenv").config();

// module.exports = {
//   development: {
//     username: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DB,
//     host: process.env.MYSQL_HOST,
//     dialect: process.env.MYSQL_DIALECT || "mysql",
//     logging: false,
//   },
// };
module.exports = {
  development: {
    use_env_variable: "DB_CONNECTION",
    dialect: "mysql",
    logging: false,
  },
  test: { use_env_variable: "DB_CONNECTION", dialect: "mysql", logging: false },
  production: {
    use_env_variable: "DB_CONNECTION",
    dialect: "mysql",
    logging: false,
  },
};