const mongoose = require('mongoose');
const User = mongoose.model('User');
const {isObjectId} = require('../helpers/validator');

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch(err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!isObjectId(id)) {
            return res.status(400).end();
        }

        await User.findByIdAndRemove(id);
        res.status(200).end();
    } catch(err) {
        next(err);
    }
};
