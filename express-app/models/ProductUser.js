'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductUser = sequelize.define('ProductUser', {
    productId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  });

  return ProductUser;
};