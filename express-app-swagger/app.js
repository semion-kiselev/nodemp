const express = require('express');
const mongoose = require('mongoose');
require('./models/User');
require('./models/Product');
require('./models/City');
const session = require('express-session');
const sessionConfig = require('./config/session');
const passport = require('passport');
require('./config/auth');
const SwaggerExpress = require('swagger-express-mw');
const app = express();
module.exports = app; // for testing

const config = {
    appRoot: __dirname // required config
};

app.use(session(sessionConfig));
app.use(express.json());
app.use(passport.initialize());

SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) { throw err; }

    swaggerExpress.register(app);

    // swaggerExpress.runner.swaggerTools.swaggerSecurity({
    //     jwt: function (req, authOrSecDef, scopesOrApiKey, cb) {
    //         console.log('GOT HERE =============');
    //         cb();
    //     }
    // });

    const port = process.env.PORT || 10010;
    mongoose.connect('mongodb://nodempuser:nodempuser@ds157185.mlab.com:57185/nodemp')
        .then(() => app.listen(port))
        .catch(err => console.error);


    if (swaggerExpress.runner.swagger.paths['/hello']) {
        console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
    }
});
