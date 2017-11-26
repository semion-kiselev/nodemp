const mongoose = require('mongoose');
require('./models/User');
require('./models/Product');
require('./models/City');
const {loadCollectionIfNotExists} = require('./helpers/mocks');
const users = require('./mocks/users.json');
const products = require('./mocks/products.json');
const cities = require('./mocks/cities.json');
const User = mongoose.model('User');
const Product = mongoose.model('Product');
const City = mongoose.model('City');
const app = require('./app');

mongoose.Promise = global.Promise;

const start = async () => {
    try {
        await mongoose.connect('mongodb://nodempuser:nodempuser@ds157185.mlab.com:57185/nodemp');
        await Promise.all([
            loadCollectionIfNotExists(User, users),
            loadCollectionIfNotExists(Product, products),
            loadCollectionIfNotExists(City, cities)
        ]);

        app.listen(8080);
    } catch(err) {
        throw err;
    }
};

start().catch((err) => console.error(`db connection error: ${err.message}`));
