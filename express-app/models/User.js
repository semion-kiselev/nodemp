'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    login: DataTypes.STRING,
    password: DataTypes.STRING
  });

    User.associate = function (models) {
        User.belongsToMany(models.Product, {through: 'ProductUsers', foreignKey: 'userId'});
    };

  return User;
};