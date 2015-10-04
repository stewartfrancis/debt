var Sequelize = require('sequelize');
var config = require('./config');

module.exports = new Sequelize(
    config.database,
    config.username,
    config.password,
    config.options);