const app = require('./app');
const pgDb = require('./models');
const users = require('./mocks/users.json');
const products = require('./mocks/products.json');
const {loadUsersIfNotExist, loadProductsIfNotExist} = require('./helpers/mocks');

const port = process.env.PORT || 8080;

pgDb.sequelize.authenticate()
    .then(async () => {
        await loadUsersIfNotExist(pgDb, users);
        await loadProductsIfNotExist(pgDb, products);
        app.listen(port, () => console.log(`App listening on port ${port}!`));
    })
    .catch(err => console.error('Unable to connect to the database:', err));

