const passport = require('passport');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../../config/auth');

// function login (req, res) {
//     res.json({
//         "code": 200,
//         "message": "OK",
//         "data": {
//             "user": {
//                 "username": "semion_kiselev"
//             }
//         },
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMTA3NTczYzg5NmFhMzM4YzFkMjRjNSIsImlhdCI6MTUxMjgzMTU5NiwiZXhwIjoxNTEyODM1MTk2fQ.X7Jy5pobtUA-G_6kxtgw-H8KDymIC_PmDYdqJPUrmsY"
//     });
// }

const authCb = (req, res, next) => (err, user) => {
    if (err) {
        return res.status(500).end();
    }

    if (!user) {
        return res.status(404).json({
            code: 404,
            message: 'Not Found',
            data: {}
        })
    }

    const token = jwt.sign({id: user.id}, jwtSecret, {expiresIn: '24h'});
    return res.json({
        code: 200,
        message: 'OK',
        data: {
            user: {
                email: user.login,
                username: user.username
            }
        },
        token
    });
};

function login(req, res, next) {
    passport.authenticate('local', authCb(req, res, next))(req, res, next);
}

module.exports = {
    login
};