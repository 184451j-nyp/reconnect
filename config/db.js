require("dotenv").config();
module.exports = {
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "reconnect"
}
