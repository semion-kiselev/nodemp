const mongoose = require('mongoose');
require('./models/User');
require('./models/Product');
require('./models/City');
const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
module.exports = app; // for testing

const config = {
    appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) { throw err; }

    // install middleware
    swaggerExpress.register(app);

    const port = process.env.PORT || 10010;
    mongoose.connect('mongodb://nodempuser:nodempuser@ds157185.mlab.com:57185/nodemp')
        .then(() => app.listen(port))
        .catch(err => console.error);


    if (swaggerExpress.runner.swagger.paths['/hello']) {
        console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
    }
});
