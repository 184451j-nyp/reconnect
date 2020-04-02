// Bring in Sequelize
const Sequelize = require('sequelize');
// Bring in db.json which contains database name, username and password
const db = require('./db');
// Instantiates Sequelize with database parameters
const sequelize = new Sequelize(db.database, db.user, db.password, {
    host: db.host, // Name or IP address of MySQL server
    port: db.port,
    dialect: 'mysql', // Tells squelize that MySQL is used
    operatorsAliases: 1,
    timezone: "+08:00",
    pool: { // Database system params, don't need to know
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: 0 //disables sql statement logging
});
module.exports = sequelize;