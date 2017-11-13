const {User} = require('../models');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch(err) {
        throw err;
    }
};
