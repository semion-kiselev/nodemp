const mongoose = require('mongoose');
const User = mongoose.model('User');

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
        await User.findByIdAndRemove(req.params.id);
        res.status(200).end();
    } catch(err) {
        next(err);
    }
};
