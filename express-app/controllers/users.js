const users = require('../mocks/users');

exports.getUsers = (req, res) => {
    res.json(users);
};
