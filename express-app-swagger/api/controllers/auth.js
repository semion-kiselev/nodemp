exports.login = (req, res) => {
    res.json({
        "code": 200,
        "message": "OK",
        "data": {
            "user": {
                "username": "semion_kiselev"
            }
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMTA3NTczYzg5NmFhMzM4YzFkMjRjNSIsImlhdCI6MTUxMjgzMTU5NiwiZXhwIjoxNTEyODM1MTk2fQ.X7Jy5pobtUA-G_6kxtgw-H8KDymIC_PmDYdqJPUrmsY"
    });
};
