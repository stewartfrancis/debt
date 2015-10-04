var sequelize = require('../sequelize')
  , Sequelize = require('sequelize');
  
var User = sequelize.define('User', {
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
});

var Debt = sequelize.define('Debt', {
    created: Sequelize.DATE,
    amount: Sequelize.INTEGER,
    settled: Sequelize.DATE
});

Debt.belongsTo(User, {as: 'From'});
User.hasMany(Debt, {as: 'From', foreignKey: 'FromId'}); //Need to override the foreign key for aliases

Debt.belongsTo(User, {as: 'To'});
User.hasMany(Debt, {as: 'To', foreignKey: 'ToId'}); //Need to override the foreign key for aliases

module.exports = {
    User: User,
    Debt: Debt
};