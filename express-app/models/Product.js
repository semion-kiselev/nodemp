'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    company: DataTypes.STRING,
    price: DataTypes.STRING,
    isbn: DataTypes.STRING
  });

    Product.associate = function (models) {
        Product.belongsToMany(models.User, {through: 'ProductUsers', foreignKey: 'productId'});
    };

  return Product;
};