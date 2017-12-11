const mongoose = require('mongoose');
const User = mongoose.model('User');
const {isObjectId} = require('../helpers/validator');

function getUsers(req, res, next) {
    User.find()
        .then(users => res.json(users))
        .catch(next);
}

function deleteUser(req, res, next) {
    const id = req.swagger.params.userId.value;

    if (!isObjectId(id)) {
        return res.status(400).end();
    }

    User.findByIdAndRemove(id)
        .then(() => res.status(200).end())
        .catch(next);
}

module.exports = {
    getUsers,
    deleteUser
};
